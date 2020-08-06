import {initComponent, destroy} from '../Utils'
import Items from '../../src/components/Items.vue'
import _ from 'lodash'

let wrapper

describe('Items.vue', () => {

    afterEach(() => {
        destroy(wrapper)
    });

    test('component name', () => {
        wrapper = initComponent(Items)
        expect(wrapper.name()).toBe('Items')
    })

    test('component props', () => {
        wrapper = initComponent(Items)
        expect(_.keys(wrapper.props())).toHaveLength(1)
    })

})
