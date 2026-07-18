# How to add a blog post

Two ways. Pick whichever suits the post.

## The easy way (no HTML)

Write the article in Word, Google Docs or plain text. Send it over along with a
one-sentence summary and a one-word tag (for example "Drafting"). You get back a
finished .html file plus the one line to add to posts.json. Upload both, commit,
merge. Done.

## The do-it-yourself way (about 5 minutes)

### 1. Make the post file
Duplicate `_template.html`. Rename your copy to a URL slug ending in `.html`,
using only lowercase letters, numbers and hyphens.

    Good:  employment-settlement-agreements-explained.html
    Bad:   Employment Settlement Agreements.html

The file `employment-settlement-agreements-explained.html` becomes the live page
`/blog/employment-settlement-agreements-explained`.

### 2. Fill in the blanks
Open your new file and replace every marker written like `[[ THIS ]]`. There are
six in the top section (title, description, canonical link, dates, author) and a
few more around the headline. The template has a formatting cheat sheet built in,
so you only need a handful of tags to write the body.

### 3. Add one line to posts.json
`posts.json` is the list that builds the blog page. Open it and add an entry for
your post. Copy an existing block, change the values, and mind the commas: every
entry except the last one ends with a comma.

    {
      "slug": "employment-settlement-agreements-explained",
      "title": "Employment settlement agreements, explained",
      "excerpt": "A short summary that shows on the blog listing and in search results.",
      "tag": "Employment",
      "date": "2026-08-01",
      "readingTime": "5 min read",
      "author": "Jonny Braden"
    }

The `slug` must match your file name without the `.html`.

### 4. Ship it
Commit on a branch, open the pull request, check the Netlify deploy preview, then
merge. The post appears on the blog automatically, newest first.

---

## A note on SEO

Google now penalises sites that publish large volumes of unreviewed AI content.
Every post here should be genuinely useful and reviewed by a person before it
goes live. A steady stream of good posts beats a flood of thin ones.
