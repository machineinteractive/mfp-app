import feedparser


feed = feedparser.parse("https://musicforprogramming.net/rss.xml")

print(len(feed.entries))

for entry in feed.entries:
    # print(entry.title)
    # print(entry.link)
    # print(entry.published)
    # print(entry.summary)
    # print(entry.guid)
    # print()
    print(f"""<a href="{entry.guid}">{entry.title.replace("Episode ", "")}</a>""")

