# Quick Safety Commands

- npm audit --production
- npm outdated
- dotnet list package --vulnerable
- git log -p -S 'TODO' --since='30 days ago'  # hunt for risky leftovers
- grep -R --line-number 'any' web/src | wc -l  # count loose types
