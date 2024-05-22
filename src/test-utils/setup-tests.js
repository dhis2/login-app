import '@testing-library/jest-dom'
import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import * as matchers from 'jest-extended'
expect.extend(matchers)

configure({ adapter: new Adapter() })
