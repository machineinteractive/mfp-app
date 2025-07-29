git diff --quiet index.html
if [ "$?" -eq 1 ]; then
  echo "Changes detected in playlist. Publishing..."
  git config user.name "github-actions[bot]"
  git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
  git add .
  git commit -m "Update mfp-app playlist with latest content."
  git push
else
  echo "Changes not detected. Skipping..."
fi
