import requests

FOO_DATA = open("./tests/stories/full/3.json").read()


print(requests.post("http://localhost:5000/", {"data": FOO_DATA}).json())
