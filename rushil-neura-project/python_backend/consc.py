"""
The brief idea here is to write a feature that will extract goals, behavior patterns, ideas and basically things
that you really want to follow through but maybe didn't end up following through or the like. It will [maybe] just
mention those things or give an account of where you might have fallen short or how you can improve upon
whatever you are doing now so that you better fit the definition of "an ideal life" as given by you.

We have a massive amounts of micro and macro goals, things that we promise ourselves we will implement in our day to
day lives.Somehow these things just disappear from our stream of conscious thought and years later we end up
feeling a massive sense of non-accomplishment. This is the motivation for building this. To be an aid in long
term and short term decision making and general life choices.

Architecture:
Top to bottom:
Long term and short term.
Each one will have a list of words/phrases on the y axis and the extent to which they have been followed
on the X axis. Each of the topics on the Y axis will have a little plus sign to their left which when clicked
on will give a little explanation on why this was included, what its followed-through coefficient implies and what
can be done going forward. This will most likely RAG LLM output.

Long term:
Trained on an initial say 10% of all the data collected so far.
Input will be say 10% of the latest data. The sized obviously change such that over a long enough period
of data collection we might have a decent enough example set of what was the idea and how the idea exists now.


Short term:
This might involve more frequent training with time for obvious reasons.
More of the same idea. It should have a connection to the long term goals. If taking an action now
might have the chance of jeopardizing whatever you have defined for the future, it might not be the best
choice.


Some tools:  D3.js


import pymongo
from data_insights import return_cleaned_frames, return_start_frames
import gensim


StartDataFrame = return_start_frames()
CleanedDataFrame = return_cleaned_frames()



What those "features" might be:
Morals, values [and other behavioral traits], ideas, goals, fears and inhibitions. Things I want to do to get
'there', things I want to avoid to get away from somewhere else.


General resources:
https://news.uchicago.edu/explainer/what-is-behavioral-economics


Lets work on this as of now, build out the goal extraction [can even think of manual goal setting by user]
-extent to which they were followed-results.

Categories:
Abstract notions: eg, general emotions, thought process, outlook towards life, existence or non
existence of certain feelings, moral judgements, relationships, habits,

More direct goals: eg, weight loss, better academics, have to learn guitar by so and so etc.



#For the long term:

#This one is bottom 20% of all data collected.
LongTermInputs = CleanedDataFrame[:round((0.2*len(CleanedDataFrame)))]


#This will remain constant as its the definition of the present, which shouldnt change with time.
ShortTermInputs = CleanedDataFrame[len(CleanedDataFrame)-7:]


#These are some general sub categories to which the abstract goals might belong to. Not really a hard and fast list.
categories_of_trains = {"Abstract":
                        ["Personal Growth: Tracking changes in self-perception, thought processes, and emotional resilience",
"Mindset and Outlook: Evaluating shifts in optimism, pessimism, or general worldview over time.",
"Habit Formation: Identifying key habits the user wants to cultivate and monitoring their consistency.",
"Relationship Dynamics: Understanding how the user’s approach to relationships evolves.",
"Work-Life Balance: Assessing how the user manages stress and allocates time between personal and professional life.",
"Creative Expression: Monitoring the user’s engagement with creative pursuits and its impact on their well-being.",
"Health and Well-being: Tracking physical and mental health goals, including exercise, diet, sleep, and mindfulness practices.",
"Values and Ethics: Analyzing how the user’s core values and ethical considerations influence their decisions.",
"Problem-Solving Approach: Evaluating changes in how the user tackles challenges and obstacles.",
"Spiritual Growth: Assessing the evolution of the user’s spiritual beliefs and practices.",
"Goal Setting and Achievement: Understanding the user’s ability to set realistic goals and their progress in achieving them."],
                        "Semi to Non-semi definite":
                            []
                        }

relevant_words = ["want", "do", "need", "change", "should", "feel", "work", "more", "less", "avoid", "increase", "grow",
                "end", "begin", "try", "avoid"]



#LDA here


"""


