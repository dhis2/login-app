import * as DOMPurify from 'dompurify'
import parse from 'html-react-parser'

export const unescapeHTML = (html) => {
    const parser = new DOMParser()
    const dom = parser.parseFromString(html, 'text/html')
    return dom?.body?.textContent
}

export const removeHTMLTags = (text) => text.replace(/(<([^>]+)>)/gi, '')

export const sanitizeMainHTML = (html) =>
    DOMPurify.sanitize(html, {
        FORCE_BODY: true,
        ADD_TAGS: ['style', 'iframe'],
    })

export const convertHTML = (html) => parse(DOMPurify.sanitize(html))
