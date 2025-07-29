from dataclasses import asdict, dataclass, field
from typing import List
import feedparser
import re
import requests
from jinja2 import Environment, FileSystemLoader, select_autoescape
import json



@dataclass
class Episode:
    title: str
    link: str
    pubDate: str
    guid: str
    tracks: str
    links: str

def main():
    episodes = []


    #
    # always fetch RSS feed to get the latest episodes
    # this is the safest way to ensure we have the most up-to-date information
    #

    feed = feedparser.parse("https://musicforprogramming.net/rss.xml")

    print(len(feed.entries))

    for entry in feed.entries:
        episode = Episode(
            title=entry.title,
            link=entry.link,
            pubDate=entry.published,
            guid=entry.guid,
            tracks="",
            links=""
        )
        episodes.append(episode)
        # print(entry.title)
        # print(entry.link)
        # print(entry.published)
        # print(entry.summary)
        # print(entry.guid)
        # print()
        #print(f"""<a href="{entry.guid}">{entry.title.replace("Episode ", "")}</a>""")

    #print(episodes)

    #
    # fetch the tracklist for each episode from the latest client script
    # this is the only way I know of to get the tracklist but it is not guaranteed to work
    # in the future if the site changes how it works
    #

    r = requests.get("https://musicforprogramming.net/latest/")
    client_script_start = r.text.find("/client/client")
    client_script_end = r.text[client_script_start:].find('";s.type')
    #print("client_script_start/end: ", client_script_start, client_script_end)
    cur_client_script = r.text[client_script_start:client_script_start + client_script_end]
    #print("Current client script:", cur_client_script)

    r = requests.get("https://musicforprogramming.net" + cur_client_script)
    data = r.text
    #print(data)
    json_start = data.find("const Xt")
    json_end = data.find("function Qt(t)")
    #print(json_start, json_end)
    json_data = data[json_start:json_end].replace("const Xt=[", "").replace("];", "")
    #print(json_data)

    json_data_regex = r"\{(.*?)\}"

    links_regex = r',"links:.*$'
    links_http_regex = r'">(.*?)</a>'

    json_objects = [o for o in re.findall(json_data_regex, json_data) if 'type:"episode"' in o]

    n = len(json_objects)

    for json_obj in json_objects:
        scrubbed = json_obj.replace("\",", "\",\"") \
        .replace(":\"", "\":\"") \
        .replace("{slug", "{\"slug") \
        .replace(",\"order:", ",\"order\":") \
        .replace(",title\"", ",\"title\"") \
        .replace("special:!0", "special\":\"!0") \
        .replace("!0,file", "!0\",\"file")
        print(scrubbed)    

        links_removed = re.sub(links_regex, " }", scrubbed)
        print(links_removed)

        tracklist_start = links_removed.find('"tracklist":"')
        tracklist_end = links_removed.find('" }')
        print(tracklist_start, tracklist_end)

        tracks = links_removed[tracklist_start:tracklist_end] \
        .replace('"tracklist":"', '') \
        .replace('\\n', '') \
        .replace('\\t', '') \
        .strip() \
        .split('<br>')[:-1]
        
        print("Tracks:", tracks)

        link_matches = re.findall(links_http_regex, scrubbed[scrubbed.find('"links:'):])
        for link in link_matches:        
            print("Link:", link)

        episode = episodes[n - 1]
        episode.tracks = json.dumps(tracks)
        episode.links = json.dumps(link_matches)

        n -= 1

        print("\n\n")


    print("Episodes:", episodes)

    environment = Environment(loader=FileSystemLoader("templates/"), autoescape=select_autoescape())
    template = environment.get_template("mfp-template-index.html")

    output = template.render(episodes=episodes)

    with open("index.html", "w") as f:
        f.write(output)

    episodes_json = json.dumps([episode.__dict__ for episode in episodes], indent=4)
    print("Episodes JSON:", episodes_json)
    with open("public/episodes.json", "w") as f:
        f.write(episodes_json)

if __name__ == "__main__":
    main()


