import { defineConfig } from 'tinacms'

export default defineConfig({
  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },
  schema: {
    collections: [
      {
        name: 'blog',
        label: 'Blog Posts',
        path: 'content/blog',
        format: 'mdx',
        fields: [
          { name: 'title', label: 'Title', type: 'string' },
          { name: 'publishedAt', label: 'Published At', type: 'datetime' },
          { name: 'image', label: 'Image', type: 'string' },
          { name: 'summary', label: 'Summary', type: 'string' },
          { name: 'author', label: 'Author', type: 'string' },
          { name: 'authorImg', label: 'Author Image', type: 'string' },
          { name: 'body', label: 'Body', type: 'rich-text' },
        ],
      },
    ],
  },
})
