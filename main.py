import json
import os
import random
from tempfile import NamedTemporaryFile

from flask import Flask, jsonify, request

app = Flask(__name__)


def load(ifilename):
    with open(ifilename) as ifile:
        data = json.load(ifile)

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


@app.route("/", methods=["POST", "GET"])
def hello_world():
    data = request.values.get("data", open("./tests/stories/full/3.json").read())

    with NamedTemporaryFile(
        "w"
    ) as ifile, NamedTemporaryFile() as ofile_json, NamedTemporaryFile() as ofile_html:
        ifile.write(data)
        ifile.flush()

        os.system(
            f"npm run workflow:aiconvert -- {ifile.name} template.json {ofile_json.name} {ofile_html.name}"
        )

        with open(ofile_json.name) as story_data, open(ofile_html.name) as content:
            return jsonify(
                {"story_data": json.load(story_data), "content": content.read()}
            )
