git checkout main
git pull origin main
git add -A
git commit -m 'renew'
git push origin main
git checkout dev
git merge main
git push origin dev