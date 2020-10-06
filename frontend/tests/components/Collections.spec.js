import {initComponent, destroy} from '../Utils'
import Collections from '../../src/components/Collections.vue'
import _ from 'lodash'

let wrapper

describe('ICollection.vue', () => {

    afterEach(() => {
        destroy(wrapper)
    });

    test('component name', () => {
        wrapper = initComponent(Collections, {collections: []}, true)
        expect(wrapper.name()).toBe('Collections')
    })

    test('component props', () => {
        wrapper = initComponent(Collections, {collections: []}, true)
        expect(_.keys(wrapper.props())).toHaveLength(1)
    })
})