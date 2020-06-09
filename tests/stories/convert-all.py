import os
import glob


for ifilename in glob.glob("./tests/stories/*/*.json"):
    ofilename = ifilename.replace("stories/", "stories-out/").rstrip(".json")
    ofilename = os.path.realpath(ofilename)

    print(ofilename)
    os.makedirs(os.path.dirname(ofilename), exist_ok=True)

    cmd = os.system(
        f"npm run workflow:aiconvert -- {ifilename} template.json {ofilename}.json {ofilename}.html"
    )
