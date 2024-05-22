import React from 'react'
import { convertHTML, sanitizeMainHTML, removeHTMLTags } from '../handleHTML.js'

describe('sanitizeMainHTML', () => {
    it('removes <script> tags', () => {
        const before =
            '<div>hello</div><div>another</div><script>maliciousFunction()</script>'
        const after = '<div>hello</div><div>another</div>'
        expect(sanitizeMainHTML(before)).toBe(after)
    })
    it('keeps <style> tags', () => {
        const before =
            '<head><style>myCss{}></style></head><body><div>hello</div><div>another</div><script>maliciousFunction()</script></body>'
        const after =
            '<style>myCss{}></style><div>hello</div><div>another</div>'
        expect(sanitizeMainHTML(before)).toBe(after)
    })
    it('fixes missing closing tags', () => {
        const before = '<div><p>okay</p><p>not okay</div>'
        const after = '<div><p>okay</p><p>not okay</p></div>'
        expect(sanitizeMainHTML(before)).toBe(after)
    })
})

describe('convertHTML', () => {
    it('converts into an array of HTML elements', () => {
        const before = '<div>one</div><div><p>some content</p></div>'
        const after = [
            <div key="0">one</div>,
            <div key="1">
                <p>some content</p>
            </div>,
        ]
        expect(convertHTML(before)).toEqual(after)
    })
})

describe('removeHTMLTags', () => {
    it('removes html tag from text', () => {
        const before =
            'My <strong>wonderful</strong> <a href="some_link">DHIS2 instance</a>'
        const after = 'My wonderful DHIS2 instance'
        expect(removeHTMLTags(before)).toBe(after)
    })
})

// export const removeHTMLTags = (text) => text.replace(/(<([^>]+)>)/gi, '')

// export const sanitizeMainHTML = (html) =>
//     DOMPurify.sanitize(html, {
//         FORCE_BODY: true,
//         ADD_TAGS: ['style', 'iframe'],
//     })

// export const convertHTML = (html) => parse(DOMPurify.sanitize(html))
