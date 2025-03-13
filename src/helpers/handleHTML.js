import DOMPurify from 'dompurify'
import parse from 'html-react-parser'

export const removeHTMLTags = (text) => text.replace(/(<([^>]+)>)/gi, '')

DOMPurify.addHook('afterSanitizeAttributes', function (node) {
    if (node.tagName.toLowerCase() === 'a') {
        node.setAttribute('target', '_blank')
        node.setAttribute('rel', 'noreferrer')
    }
})

export const sanitizeMainHTML = (html) =>
    DOMPurify.sanitize(html, {
        FORCE_BODY: true,
        ADD_TAGS: ['style', 'iframe'],
    })

export const convertHTML = (html) => parse(DOMPurify.sanitize(html))
