"""
This file will perform all the model building and the generation of responses based on the versionInput and
the userInput which we will get from the file ./userinput.py through a flask API.
Lets see how this one goes.

"""
import pymongo
import pandas as pd
from langchain_text_splitters import RecursiveCharacterTextSplitter
import os
import shutil
from chromadb.config import Settings
import numpy as np
import chromadb
from chromadb.utils import embedding_functions
from transformers import LlamaTokenizer, LlamaForCausalLM


userInput = "Hey, how are you doing?"
#Say
versionInput = "2024-07-23"
LLM_output = ""

client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["neura-react-server"]
collection = db["datamodels"]

dataBase = pd.DataFrame(list(collection.find()))
datearray = pd.Series([str(i)[:10] for i in dataBase['date']])
dataBase['date'] = datearray


document_array = []

"""
import spacy
nlp = spacy.load('en_core_web_sm')
"""

data_array = {"input1": [],  "input2": [], "input3": [], "input4": [], "input5": [], "input6": [], "input7":[]}
cleaned_data_array = {"input1": [],  "input2": [], "input3": [], "input4": [], "input5": [], "input6": [], "input7":[]}


date_array = dataBase['date']
for i in range(len(dataBase)):
    stack = dataBase["entries"][i]
    for j in stack:
        data_array[j['id']].append(j['content'])
        #document = nlp(j['content'])
        #cleaned_data_array[j['id']].append([tok.lemma_ for tok in document if (tok.is_stop!=True and tok.is_punct!=True and tok.is_digit!=True)])
#This is how you access the data.

StartDataFrame = pd.DataFrame(data_array)
#CleanedDataFrame = pd.DataFrame(cleaned_data_array)
StartDataFrame["date"] = datearray

loc1 = pd.DataFrame()
loc2 = pd.DataFrame()

for i in range(len(StartDataFrame)):
    if(StartDataFrame['date'][i]==versionInput):
        loc1 = StartDataFrame.loc[i-5:i]
        loc2 = StartDataFrame.loc[i+1:i+4]

frames = [loc1, loc2]
#This is the plus minus 5 entries of the date chosen. 5 is arbitrary at the moment, we can tinker it as we go on.
FinalChangedFrame = pd.concat(frames)

#Lets create the model first and then figure out the qna thing.



"""
A little summary of how transformers work.
First there is a pretrained vector embeddings matrix for all the 50,000 words on which the model has been trained.
This is a bit like the word2vec algorithm.

When user inputs a certain prompt, each of the tokens in the prompt are assigned a vector which is essentially the
same non-contex embedding vector derived from the given matrix.
The next step is attention which is responsible for taking into account the context of other words present in the
prompt.

Attention is generally multi headed and this is what one head of attention does.
Essentially there are three classes of model parameters that are learned: the keys, queries and the values. The keys
and queries essentially seek to ask and answer questions about each of the words in the prompt.
These questions are trivial in that they are too complex to be simplified. The key matrix and the query matrix is
multiplied with each of the embeddings to give us a n*n matrix where n is the number of tokens. Through dot products
it is figured out which previous words influence which words further down the sentence.
Finally the value vecs for calculated for each token in the prompt and then multiplied with the aformentioned values
This final weighted vector is summed up for each token to give us the "changed" vector embedding
which should store the contextual information for that token.

If this is not beyond my human comprehension then what is?
"""


fcf_md = FinalChangedFrame.to_markdown()
text_splitter = RecursiveCharacterTextSplitter(
    separators=[
        "\n\n",
        "\n",
        "\u200b",  # Zero-width space
        "\uff0c",  # Fullwidth comma
        "\u3001",  # Ideographic comma
        "\uff0e",  # Fullwidth full stop
        "\u3002",  # Ideographic full stop
        "|"
    ],
    chunk_overlap = 10,
    length_function = len,
)
docs = text_splitter.create_documents([fcf_md])

del docs[0]
del docs[0]



client = chromadb.Client()


collection = client.get_or_create_collection(name="my_collection")


def add_documents_to_collection(collection, documents):
    texts = [doc.page_content for doc in documents]
    ids = [str(i) for i in range(len(documents))]

    collection.add(
        documents=texts,
        ids=ids,
    )


docs_texts = add_documents_to_collection(collection, docs)

#The idea here is to limit our query space after every single user prompt.
#We will set it as 2 right now as anything above or below seems to give either too much or too less of a data space.



def query_collection(collection, query_text, n_results=2):
    """
    Searches the ChromaDB collection for documents matching the query text.

    Args:
        collection: The ChromaDB collection to search in.
        query_text: The search query text.
        n_results: Number of top results to return. Defaults to 5.

    Returns:
        List of tuples containing document ids and corresponding contents.
    """
     # Perform the query
    results = collection.query(
        query_texts=[query_text],
        n_results=n_results,
    )

    # Extracting the results
    rang = len(results['documents'][0])
    matched_docs = [results['documents'][0] for result in range(rang) if (results['distances'][0])[result]>=1]

    return matched_docs



#This will be from our continuous user input stream.

query_text = "How do you think you are dealing with all the stress and anxiety?"
matched_docs = query_collection(collection, query_text)


def when_docs_avail():
    all_searchRes = []
    for i in matched_docs[0]:
        for j in range(len(matched_docs[0])):
            match = matched_docs[0][j].split('|')
            match = match[2:]
            all_searchRes.append(match)


    all_searchRes = np.array(all_searchRes)
    all_searchRes = np.reshape(all_searchRes, (all_searchRes.shape[0]*all_searchRes.shape[1], ))

    context = ''.join(all_searchRes)

    tokenn = ''
    tokenizer = LlamaTokenizer.from_pretrained("openlm-research/open_llama_7b", token = tokenn)

# Load the model
    model = LlamaForCausalLM.from_pretrained("meta-llama/Meta-Llama-3.1-405B",
                                        device_map="auto",  # To automatically map model to available GPUs
                                        load_in_8bit=True,  # For memory efficiency (optional)
                                        torch_dtype=torch.float16,
                                        token = tokenn)  # Use float16 for efficiency

    prompt = f"Respond based only on this context: {context}. \n Behave as much as possible as if you were the agent writing all of  these things, exhibiting the same traits as the hypothetical individual writing this. \n Answer and converse based off of this current user prompt: {query_text}"


    inputs = tokenizer(prompt, return_tensors="pt", truncation=True)
    outputs = model.generate(**inputs, max_new_tokens=200)
    response = tokenizer.decode(outputs[0], skip_special_tokens=True)
    print(response)


if(len(matched_docs)==0):
    LLM_output = "You're talking about stuff that I dont really recall. Lets talk about something else."
else:
    when_docs_avail()

#try this for torch: --index-url https://download.pytorch.org/whl/cpu instead of the other url.
"""

This LLama doesnt work here but it does work in the awdo ipynb. Write the code there, convert it to
.py and integrate it with flask.

"""