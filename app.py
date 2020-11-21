from bson import json_util
from pymongo import MongoClient
from flask import Flask, render_template, jsonify, request, json

app = Flask(__name__)
client = MongoClient('mongodb://sparta:beausejour@localhost', 27017)
# client = MongoClient('localhost', 27017)

db = client.dbsparta


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/api/list', methods=['GET'])
def show_dream():
    # dream_data = list(db.drandom.find({}, {'_id': False}))
    randomTrue = list(db.drandom.aggregate([
        {'$match': {'is_text': True}},
        {'$sample': {'size': 1}}
    ]))
    randomFalse = list(db.drandom.aggregate([
        {'$match': {'is_text': False}},
        {'$sample': {'size': 1}}
    ]))
    return json.loads(json_util.dumps({'result': 'success',
                                       'randomTrue': randomTrue,
                                       'randomFalse': randomFalse
                                       }))

@app.route('/review', methods=['POST'])
def write_review():
    title_receive = request.form['title_give']
    dream_receive = request.form['dream_give']

    review = {
        'title': title_receive,
        'dream': dream_receive,
        'is_text': True
    }
    db.drandom.insert_one(review)
    return jsonify({'result': 'success', 'msg': '리뷰가 성공적으로 작성되었습니다.'})

@app.route('/search', methods=['GET'])
def run_search():
    search_receive = request.args.get('search_give')
    print(search_receive)
    search_result = list(db.drandom.find({'$text': {'$search': search_receive}}))
    print(search_result)
    return json.loads(json_util.dumps({'result': 'success',
                                       'search': search_result
                                       }))

@app.route('/api/count', methods=['GET'])
def show_count():
    count = db.drandom.find().count()
    return json.loads(json_util.dumps({'result': 'success',
                                       'count': count
                                       }))

if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)




# Indexing
# db.getCollection('drandom').createIndex({title:'text', dream:'text'})