import os
import glob
import json
import random


def samples():
    workdir = os.path.dirname(__file__)
    return glob.glob(f"{workdir}/*/*.json")


def load(ifilename):
    with open(ifilename) as ifile:
        data = json.load(ifile)

        # rewrite layout to easier test

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


def convert():
    for ifilename in samples():
        ofilename = ifilename.replace("stories/", "stories-out/").rstrip(".json")
        ofilename = os.path.realpath(ofilename)

        data = load(ifilename)
        test_filename = ifilename.replace("stories/", "stories-tmp/")
        os.makedirs(os.path.dirname(test_filename), exist_ok=True)

        with open(test_filename, "w") as ofile:
            json.dump(data, ofile, indent=4, ensure_ascii=False)

        print(ofilename)
        os.makedirs(os.path.dirname(ofilename), exist_ok=True)

        os.system(
            f"npm run workflow:aiconvert -- {test_filename} template.json {ofilename}.json {ofilename}.html"
        )


def data():
    for ifilename in samples():
        with open(ifilename) as ifile:
            content = json.load(ifile)

            for i, page in enumerate(content.pop("pages")):
                x = dict(page)
                x.update(content)
                x["filepath"] = ifilename
                x["filename"] = os.path.basename(ifilename)
                x["index"] = i

                yield x


if __name__ == "__main__":
    convert()
