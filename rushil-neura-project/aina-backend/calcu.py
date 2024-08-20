"""
This file will perform all the model building and the generation of responses based on the versionInput and
the userInput which we will get from the file ./userinput.py through a flask API.
Lets see how this one goes.

"""
import pymongo
import pandas as pd
from langchain_text_splitters import RecursiveCharacterTextSplitter
import os
import glob
import shutil
import numpy as np
import chromadb
import openai
from dotenv import load_dotenv


load_dotenv()
openai.api_key = os.environ.get('OPENAI_API_KEY')


client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["neura-react-server"]
collection = db["datamodels"]


dataBase = pd.DataFrame(list(collection.find()))
dateArray = pd.Series([str(i)[:10] for i in dataBase['date']])
dataBase['date'] = dateArray
dateArray = list(dateArray)
document_array = []


data_array = {"input1": [],  "input2": [], "input3": [], "input4": [], "input5": [], "input6": [], "input7":[]}
cleaned_data_array = {"input1": [],  "input2": [], "input3": [], "input4": [], "input5": [], "input6": [], "input7":[]}


date_array = dataBase['date']
for i in range(len(dataBase)):
    stack = dataBase["entries"][i]
    for j in stack:
        data_array[j['id']].append(j['content'])


StartDataFrame = pd.DataFrame(data_array)
StartDataFrame["date"] = dateArray


def return_reference_docs(version):
    versionsName = ["Genesis", "Origins", "Echo", "Whisper", "Now"]
    predefined_versions =  {"Genesis":{"startDate": "", "endDate": ""},
                        "Origins": {"startDate": "", "endDate": ""},
                        "Echo": {"startDate": "", "endDate": ""},
                        "Whisper": {"startDate": "", "endDate": ""},
                        "Now": {"startDate": "", "endDate": ""}}

    num_divs = int(len(dateArray)/len(predefined_versions))

    for i in range(num_divs):
        omega  = i*len(predefined_versions)
        alpha = dateArray[omega: omega+num_divs]
        predefined_versions[versionsName[i]]["startDate"] = alpha[0]
        predefined_versions[versionsName[i]]["endDate"] = alpha[-1]

    userVersionStartDate = predefined_versions[version]['startDate']
    userVersionEndDate = predefined_versions[version]['endDate']

    FinalChangedFrame = pd.DataFrame()

    for i in range(len(StartDataFrame)):
        if(StartDataFrame['date'][i]==userVersionStartDate):
            j=i
            while(StartDataFrame['date'][j]!=userVersionEndDate):
                j+=1
            FinalChangedFrame = StartDataFrame.loc[i:j+1]

    fcf_md = FinalChangedFrame.to_markdown()
    text_splitter = RecursiveCharacterTextSplitter(
        separators=[
            "\n\n",
            "\n",
            "|"
        ]
    )
    docs = text_splitter.create_documents([fcf_md])

    del docs[0]
    del docs[0]

    path = './aina-backend'
    if os.path.exists(path):
        shutil.rmtree(path)

    client = chromadb.PersistentClient(path = './aina-backend')

    collection = client.create_collection(name="my_collection")

    def add_documents_to_collection(collection, documents):
        texts = [doc.page_content for doc in documents]
        ids = [str(i) for i in range(len(documents))]

        collection.add(
            documents=texts,
            ids=ids,
        )

    docs_text = add_documents_to_collection(collection, docs)

    return collection


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


def return_query_collection(collection, query_text):
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
        n_results=2,
    )

    # Extracting the results
    rang = len(results['documents'][0])
    matched_docs = [results['documents'][0] for result in range(rang) if (results['distances'][0])[result]>=1]

    return matched_docs

def when_docs_avail(matched_documents, query_text, versionInput):
    all_searchRes = []
    for i in matched_documents[0]:
        for j in range(len(matched_documents[0])):
            match = matched_documents[0][j].split('|')
            match = match[2:]
            all_searchRes.append(match)


    all_searchRes = np.array(all_searchRes)
    all_searchRes = np.reshape(all_searchRes, (all_searchRes.shape[0]*all_searchRes.shape[1], ))

    context = ''.join(all_searchRes)

    prompt = f"Respond based only on this context: {context}. \n Behave as much as possible as if you were the agent writing all of  these things, exhibiting the same traits as the hypothetical individual writing this. Mimic their language as well, dont make it too formal. When asked who you are, reply say that you are the user's version of choice which is {versionInput}. \n Answer and converse based off of this current user prompt: {query_text}"

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=600,
        temperature=0.9,
        top_p=0.9
    )
    return list(response.choices)[0].message.content
