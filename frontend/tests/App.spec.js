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

  it('initRpc - method', () => {
    wrapper = initComponent(App, {}, true)
    wrapper.vm.rpc = {
      invoke: jest.fn().mockImplementation(async () => { return { data: {} }; }),
      registerMethod: jest.fn()
    }
    
    wrapper.vm.showCollections = jest.fn()

    const invokeSpy = jest.spyOn(wrapper.vm.rpc, 'invoke')
    const registerMethodSpy = jest.spyOn(wrapper.vm.rpc, 'registerMethod')
    wrapper.vm.initRpc();
    
    expect(registerMethodSpy).toHaveBeenCalledWith({func: wrapper.vm.showCollections, thisArg: wrapper.vm, name: 'showCollections'})
    expect(registerMethodSpy).toHaveBeenCalledWith({func: wrapper.vm.changeItemsState, thisArg: wrapper.vm, name: 'changeItemsState'})
    expect(invokeSpy).toHaveBeenCalledWith("getState")

    invokeSpy.mockRestore()
    registerMethodSpy.mockRestore()
  })

  it('reload - method', () => {
    wrapper = initComponent(App)

    wrapper.vm.rpc = {
      invoke: jest.fn().mockImplementation(async () => { return { data: {} }; })
    }
    const invokeSpy = jest.spyOn(wrapper.vm.rpc, 'invoke')
    wrapper.vm.reload();
    
    expect(invokeSpy).toHaveBeenCalledWith("getState")

    invokeSpy.mockRestore()
  })

  it('showCollections - method', () => {
    wrapper = initComponent(App)
    wrapper.vm.showCollections("collection");
    expect(wrapper.vm.collections).toEqual("collection");
  })

  it('changeItemsState - method', () => {
    wrapper = initComponent(App)
    wrapper.vm.changeItemsState([{fqid:'fqid'}]);
  })

  it('onAction - method', () => {
    wrapper = initComponent(App, {}, true)
    wrapper.vm.rpc = {
      invoke: jest.fn().mockImplementation(async () => { return { data: {} }; })
    }
    const contextualItem = {
      item: {
        fqid: "fqid"
      },
      context: "context"
    }
    const invokeSpy = jest.spyOn(wrapper.vm.rpc, 'invoke')
    wrapper.vm.onAction(contextualItem, 1);
    
    expect(invokeSpy).toHaveBeenCalledWith("performAction", ["fqid", 1, "context"])

    invokeSpy.mockRestore()
  })

})
