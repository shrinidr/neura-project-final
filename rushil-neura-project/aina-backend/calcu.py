"""
This file will perform all the model building and the generation of responses based on the versionInput and
the userInput which we will get from the file ./userinput.py through a flask API.
Lets see how this one goes.

"""
import pymongo
import pandas as pd
from langchain_text_splitters import RecursiveCharacterTextSplitter
import chromadb
import os
import shutil
import openai
from dotenv import load_dotenv
from chromadb.config import Settings

load_dotenv()
userInput = "Hey, how are you doing?"

#Say
versionInput = "2024-07-23"

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




CHROMA_PATH = "chroma"

if os.path.exists(CHROMA_PATH):
   shutil.rmtree(CHROMA_PATH)
def get_openai_embedding(text):
    response = openai.Embedding.create(
        input=text,
        model="text-embedding-ada-002"
    )
    return response['data'][0]['embedding']

def create_and_save_embeddings(texts, collection_name, db_path):
    # Initialize Chroma Client
    client = chromadb.Client(Settings(persist_directory=db_path))

    # Create or get collection
    collection = client.get_or_create_collection(collection_name)

    # Generate embeddings and add to collection
    for text in texts:
        embedding = get_openai_embedding(text)
        collection.add(documents=[text], embeddings=[embedding])

    # Persist the database
    client.persist()

def search_similar_texts(client, collection_name, query_text, top_k=5):
    # Get collection
    collection = client.get_collection(collection_name)

    # Get embedding for query text
    query_embedding = get_openai_embedding(query_text)

    # Query collection
    results = collection.query(embeddings=[query_embedding], top_k=top_k)

    return results

# Example usage
if __name__ == "__main__":
    texts = [
        "The sky is blue.",
        "I love sunny days.",
        "The ocean is vast and beautiful.",
        "Mountains are majestic.",
        "Rainy days make me feel cozy."
    ]

    collection_name = "example_collection"
    db_path = "./chroma_db"

    # Create and save embeddings to Chroma
    create_and_save_embeddings(texts, collection_name, db_path)

    # Initialize Chroma Client for querying
    client = chromadb.Client(Settings(persist_directory=db_path))

    # Search for similar texts
    query = "I enjoy sunny weather."
    results = search_similar_texts(client, collection_name, query)

    print("Similar texts to '{}':".format(query))
    for result in results['documents']:
        print(result)