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
More of the same idea.


Some tools:  D3.js
"""

import pymongo
from data_insights import return_cleaned_frames, return_start_frames


StartDataFrame = return_start_frames()
CleanedDataFrame = return_cleaned_frames()


"""
What those "features" might be:
Morals, values [and other behavioral traits], ideas, goals, fears and inhibitions. Things I want to do to get
'there', things I want to avoid to get away from somewhere else.
"""

