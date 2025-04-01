"""
This file will perform all the model building and the generation of responses based on the versionInput and
the userInput which we will get from the file ./userinput.py through a flask API.
Lets see how this one goes.

"""
import pandas as pd
from langchain_text_splitters import RecursiveCharacterTextSplitter
import os
from openai import OpenAI
import numpy as np
import openai
from dotenv import load_dotenv
from openai import OpenAI
from sklearn.decomposition import PCA


load_dotenv()
openai.api_key = os.environ.get('OPENAI_API_KEY')
client = OpenAI(api_key= os.environ.get('OPENAI_API_KEY')) 

def generate_embeddings(texts, batch_size=50):
    embeddings = []
    for i in range(0, len(texts), batch_size):
        batch = texts[i:i+batch_size]
        response = client.embeddings.create(
            input=batch,
            model="text-embedding-3-small"
        )
        embeddings.extend([e.embedding[:1024] for e in response.data])  # Match Pinecone dimension
    return embeddings


def get_predef_versions(StartDataFrame, dateArray):
    if not dateArray:  # Ensure dateArray is not empty
        raise ValueError("dateArray cannot be empty")
    
    StartDataFrame["date"] = dateArray

    
    versionsName = ["Genesis", "Origins", "Echo", "Whisper", "Now"]
    predefined_versions = {name: {"startDate": "", "endDate": ""} for name in versionsName}

    num_dates = len(dateArray)
    num_versions = len(versionsName)
    
    num_divs = num_dates // num_versions  

    for i, version in enumerate(versionsName):
        if i * num_divs < num_dates:  
            start_idx = i * num_divs
            end_idx = min((i + 1) * num_divs - 1, num_dates - 1)

            predefined_versions[version]["startDate"] = dateArray[start_idx]
            predefined_versions[version]["endDate"] = dateArray[end_idx]
        else:
            predefined_versions[version]["startDate"] = dateArray[-1]
            predefined_versions[version]["endDate"] = dateArray[-1]

    print("these are the predef versions", predefined_versions)
    return predefined_versions



def return_date_matrix(predefined_versions_changed):
        return predefined_versions_changed

def return_reference_docs(version, StartDataFrame, date_array, index, userId):
    predefined_versions = get_predef_versions(StartDataFrame, date_array)
    userVersionStartDate = predefined_versions[version]['startDate']
    userVersionEndDate = predefined_versions[version]['endDate']

    FinalChangedFrame = pd.DataFrame()

    print("startdata frame", StartDataFrame)
    for i in range(len(StartDataFrame)):
        if(StartDataFrame['date'][i]==userVersionStartDate):
            j=i
            while(StartDataFrame['date'][j]!=userVersionEndDate):
                j+=1
            FinalChangedFrame = StartDataFrame.loc[i:j+1]

    print("final changed frame", FinalChangedFrame)
    if FinalChangedFrame.empty:
        return {"namespace": userId}
        #return {"ids": [], "metadata": []}
    
    fcf_md = FinalChangedFrame.to_markdown()

    text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,  # Larger chunks reduce total count
    chunk_overlap=200,
    separators=["\n\n", "\n", "|"]  # Simplified separators
    )

    docs = text_splitter.create_documents([fcf_md])

    print("ye wala docs", docs)

    if (len(docs)>2):
        del docs[0]
        del docs[0]

    # Clean up documents
    texts = []
    for doc in docs:
        content = doc.page_content.strip()
        if content:  # Only keep non-empty documents
            texts.append(content)

    # If no valid texts after cleaning, return empty
    print(texts)
    print("docs", docs)
    if not texts:
        return {"namespace": userId}
        
    del docs
    try:
       
        embeddings = generate_embeddings(texts)
        vectors = [
            (f"{userId}_doc_{i}", embedding, {"text": text, "user_id": userId})
            for i, (text, embedding) in enumerate(zip(texts, embeddings))
        ]
        
        # Upsert with namespace isolation
        index.upsert(
            vectors=vectors,
            namespace=userId
        )
        
        return {"namespace": userId}
    except Exception as e:
        print(f"Error generating embeddings: {e}")
        #return {"ids": [], "metadata": []}
        return {"namespace": userId}


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

def return_query_collection(collection, query_text, index, user_id):
    
    # Perform the query

    query_embedding = generate_embeddings([query_text])[0]
    
    # Query Pinecone
    query_result = index.query(
        vector=query_embedding,
        top_k=3,
        namespace=user_id,  # Critical isolation
        filter={"user_id": {"$eq": user_id}},  # Double protection
        include_metadata=True
    )
    return [match.metadata["text"] for match in query_result.matches]

def clean_query_results(query_results, reqLeng):
    cleaned = []
    for doc in query_results[:reqLeng]:  # Take first two elements
        # Split by pipe character and strip whitespace
        parts = [part.strip() for part in doc.split('|') if part.strip()]
        # Filter out empty strings and join with newlines
        clean_doc = '\n'.join([p for p in parts if p])
        cleaned.append(clean_doc)
    
    # Combine the first two cleaned documents
    context = '\n\n'.join(cleaned)
    return context


def when_docs_avail(matched_documents, query_text, versionInput, chatHistory):
    
    if len(matched_documents)>=2:
        context = clean_query_results(matched_documents, 2)
    elif (len(matched_documents)==1):
        context = clean_query_results(matched_documents, 1)
    else:
        context = ''
    client = OpenAI(api_key=os.environ.get('OPENAI_API_KEY'))


    print("this is the context", context)
    prompt = f"Respond based only on this context: {context}. \n Behave as much as possible as if you were the agent writing all of  these things, exhibiting the same traits as the hypothetical individual writing this. Mimic their language as well, dont make it too formal. When asked who you are, reply say that you are the user's version of choice which is {versionInput}. \n Answer and converse based off of this current user prompt: {query_text}"
    chatHistory.append({"role": "user", "content": prompt})
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages= chatHistory,
        max_tokens=500,
        temperature=0.9,
        top_p=0.9
    )
    return list(response.choices)[0].message.content

