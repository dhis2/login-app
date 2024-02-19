import parse from 'html-react-parser'
import * as sanitizeHtml from 'sanitize-html'

export const removeHTMLTags = (text) => text.replace(/(<([^>]+)>)/gi, '')

export const convertHTML = (html) => parse(sanitizeHtml(html))
