---
title: The CMS Is Becoming a Conversation
subtitle: In one small publication, instructions are beginning to replace the dashboard between an idea and the live site.
seoTitle: The CMS Is Becoming a Conversation
pubDate: 2026-09-03
category: Technology
tags: [publishing, CMS, AI, Astro, GitHub]
heroImage: /images/cms-conversation.webp
heroAlt: A blue speech bubble moving through paper publishing machines and emerging as a finished page
description: Field Notes is testing a conversational publishing workflow built from Markdown, Astro, Git and an AI coding agent—not a replacement for every CMS.
socialCopy: For this one-person publication, the CMS is becoming less like a dashboard and more like a conversation.
featured: false
draft: true
---

A content management system usually announces itself with an interface: a dashboard, text editor, media library, fields and a button whose meaning ranges from “save” to “tell the entire internet immediately.”

Field Notes has all the underlying needs of a small CMS. It stores articles and metadata, assigns categories, manages images, builds pages, preserves an archive and decides what appears on the homepage. What it increasingly lacks is the familiar CMS screen.

Instead, the interface is becoming a conversation.

“Publish this.”

“Make this the hero.”

“Migrate these archive pieces.”

“Fix the category page.”

“Optimize these images.”

Behind those instructions is not magic and certainly not the absence of software. There is Markdown for the articles, Astro for the site, Git and GitHub for history, GitHub Pages for hosting, and an AI coding agent that can inspect and modify the system. The machinery still exists. Conversation is becoming the layer through which the owner operates it.

## From controls to intent

Traditional interfaces require the user to translate intent into available controls. To feature an article, find the correct record, change its value, confirm that another article is no longer featured, save, preview and publish. A good CMS makes this sequence clear and safe.

A conversational interface begins one level higher. “Make this the hero” describes the desired state. The system can then translate that instruction into the necessary changes: update frontmatter, clear a conflicting flag, run validation, build the site and report what happened.

This changes the distance between editorial thought and implementation. The owner does not need to remember which file controls a category route or how a GitHub Pages base path affects an image URL. Those details remain important, but they can be handled by the system and surfaced when a decision or failure actually requires attention.

That is the attractive part. The dangerous part is exactly the same.

A form shows its boundaries. There are five category options because five options exist. A date field signals that a date is required. Conversation feels open-ended, which can make the system appear more capable, certain or authorized than it is. “Fix the site” is easy to say and impossible to interpret safely without rules about scope, validation and what must remain untouched.

The conversation therefore depends on a less visible interface: conventions.

Field Notes has instructions about article metadata, publication dates, archive treatment, hero selection, image handling, builds and Git commits. The words can be informal because the underlying agreement is not. When the owner says “publish this normally,” the system needs a precise understanding of normally.

## A CMS has responsibilities, not just screens

Removing the dashboard does not remove the work a CMS performs. It makes that work easier to overlook.

Content still needs structure. Categories must be exact enough to query. Images need stable paths and useful alt text. Publication dates must sort correctly. Drafts must remain private. A homepage needs deterministic rules when no article, one article or several articles are marked as featured. Changes need review, history and a route to recovery.

In this experiment, those responsibilities are distributed across the content schema, repository, build process and publishing instructions. The conversational agent operates the pieces, but it does not get to redefine them casually. The system is useful because conversation sits on top of constraints, not because constraints have disappeared.

This is also why the arrangement works particularly well for a one-person publication. The person giving the instruction is the editor, publisher and site owner. Ambiguity can be resolved against one editorial intention. The workflow can be opinionated because it serves one set of habits.

Scale changes the problem.

## Where the dashboard still earns its keep

Traditional CMS platforms remain valuable for reasons that have little to do with the romance of a text box. Teams need permissions. Editors need assignments, review states and approvals. Organizations need structured content that can move across products, rules about who can change what, audit trails that do not require reading a Git diff, and integrations with systems owned by other departments.

A conversational layer may eventually help with those jobs, but it does not make governance optional. “Publish this” means something different when the speaker is one writer than when the speaker is one of two hundred employees working across several markets and legal regimes.

Developers remain equally relevant. Field Notes works because someone, human or agent-assisted, can reason about templates, data models, accessibility, deployment and failure. Conversation can make technical capability easier to direct. It does not eliminate the need for technical judgment, especially when a system becomes more complex or consequential.

Nor does this experiment prove that every publishing tool should become a chat window. Some tasks are faster when the available choices are visible. It is easier to scan a calendar than ask about each date. It is easier to compare twenty images in a grid than describe them one at a time. Conversation is an interface, not a moral upgrade.

## The publication as a maintained agreement

What feels new is the ability to describe an editorial outcome in ordinary language and have the system carry it through multiple technical layers. The instruction can begin with the article rather than the software.

That makes the publishing machine feel closer to the work. It also places more weight on the maintained agreement between owner and system: what “publish” includes, what “archive” preserves, what can be changed automatically and what must be brought back for a decision.

For Field Notes, the CMS is not disappearing. It is becoming less visible as a separate destination. Its controls are moving into language, while its responsibilities remain in code, content and process underneath.

This may remain an eccentric arrangement for one small publication. That is enough. Field Notes is not a forecast disguised as a case study. It is a lived experiment in shortening the route from “I want to say this” to a finished page, while keeping enough structure to know what happened along the way.
