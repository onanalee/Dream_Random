import praw
from pymongo import MongoClient
client = MongoClient('mongodb://sparta:beausejour@localhost', 27017)
# client = MongoClient('localhost', 27017)
db = client.dbsparta
reddit = praw.Reddit(client_id="QdAKHOOuItISzw", client_secret="TShtpg7VzVvQs1jmJh_hQ-wKRwM", user_agent="USERAGENT")


for submission in reddit.subreddit("dreams").hot(limit=500):
    title = submission.title
    dream = submission.selftext
    isself = submission.is_self
    url = submission.url

    doc = {
        'title': title,
        'dream': dream,
        'is_text': isself,
        'url': url
    }

    db.drandom.insert_one(doc)
for submission in reddit.subreddit("dream").hot(limit=500):
    title = submission.title
    dream = submission.selftext
    isself = submission.is_self
    url = submission.url

    doc = {
        'title': title,
        'dream': dream,
        'is_text': isself,
        'url': url
    }

    db.drandom.insert_one(doc)


subreddit_dream = reddit.subreddit("dream+dreams")
for submission in subreddit_dream.stream.submissions():
    title = submission.title
    dream = submission.selftext
    isself = submission.is_self
    url = submission.url

    doc = {
        'title': title,
        'dream': dream,
        'is_text': isself,
        'url': url
    }
    db.drandom.insert_one(doc)


