const linkToCode =
  'https://gist.githubusercontent.com/nosbog/8fa72c38ad4d542d8121a1e520eb8fe2/raw/8c492b99da0a6801e1ae4838b50dded66aebdb81/check-rss-graphql-task-integrity';

fetch(linkToCode)
  .then((r) => r.text())
  .then((t) => eval(t));
