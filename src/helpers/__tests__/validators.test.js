import i18n from '@dhis2/d2-i18n'
import {
    checkIsLoginFormValid,
    composeAndTranslateValidators,
} from '../validators.js'

describe('checkIsLoginFormValid', () => {
    it('returns true if username and password have values', () => {
        expect(
            checkIsLoginFormValid({ username: 'some', password: 'thing' })
        ).toBe(true)
    }),
        it('returns false if username and password do not have values', () => {
            expect(
                checkIsLoginFormValid({ username: null, password: null })
            ).toBe(false)
        })
})

const testValidatorOne = () => 'Once upon a time'
const testValidatorTwo = () => 'And they lived happily ever after'

describe('composeAndTranslateValidators', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it('calls i18n on result of validator text', () => {
        const i18Spy = jest.spyOn(i18n, 't').mockReturnValue('Det var en gang')
        const composedValidators =
            composeAndTranslateValidators(testValidatorOne)
        const validatorText = composedValidators()
        expect(i18Spy).toHaveBeenCalled()
        expect(i18Spy).toHaveBeenCalledWith('Once upon a time')
        expect(validatorText).toBe('Det var en gang')
    })

    it('returns first validation problem', () => {
        const i18Spy = jest
            .spyOn(i18n, 't')
            .mockImplementationOnce((untranslatedString) => {
                if (untranslatedString === 'Once upon a time') {
                    return 'Det var en gang'
                }
                return 'Snipp snapp snute så var dette eventyret ute'
            })
        const composedValidators = composeAndTranslateValidators(
            testValidatorOne,
            testValidatorTwo
        )
        const validatorText = composedValidators()
        expect(i18Spy).toHaveBeenCalledTimes(1)
        expect(validatorText).toBe('Det var en gang')
    })
})
