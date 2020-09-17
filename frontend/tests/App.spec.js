import {initComponent, destroy} from './Utils'
import App from '../src/App.vue';
import Vue from 'vue'
import Vuetify from 'vuetify'
import { WebSocket } from 'mock-socket'

Vue.use(Vuetify);
global.WebSocket = WebSocket;

let wrapper;

describe('App.vue', () => {
  afterEach(() => {
    destroy(wrapper)
  })

  it('component name', () => {
    wrapper = initComponent(App, {}, true)
    expect(wrapper.name()).toBe('App')
  })

})
