import json
import os
import random
from tempfile import NamedTemporaryFile

from flask import Flask, jsonify, request

app = Flask(__name__)


def load(data):
    data = json.loads(data)
    layout = None
    for i, page in enumerate(data["pages"]):
        if i == 0:
            layout = "COVER"

        elif page["headline"] and page["title"]:
            layout = "NORMAL"

        elif not page["headline"]:
            if len(page["title"]) < 50:
                layout = "QUOTE"
            else:
                layout = random.choice(["FOCUS", "NORMAL"])
        else:
            raise NotImplementedError()

        page["layout"] = layout

    return data


FOO_DATA = open("./tests/stories/full/3.json").read()


@app.route("/", methods=["POST", "GET"])
def hello_world():
    data = load(request.values.get("data", FOO_DATA))

    with NamedTemporaryFile(
        "w"
    ) as ifile, NamedTemporaryFile() as ofile_json, NamedTemporaryFile() as ofile_html:
        json.dump(data, ifile)
        ifile.flush()

        os.system(
            f"npm run workflow:aiconvert -- {ifile.name} template.json {ofile_json.name} {ofile_html.name}"
        )

        with open(ofile_json.name) as story_data, open(ofile_html.name) as content:
            return jsonify(
                {"story_data": json.load(story_data), "content": content.read()}
            )
