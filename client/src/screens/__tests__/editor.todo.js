import React from 'react'
import ReactDOM from 'react-dom'
import Editor from '../editor.todo'
import * as utilsMock from '../../utils/api'

jest.mock('../../utils/api', () => {
  return {
    posts: {
      create: jest.fn(() => Promise.resolve()),
    },
  }
})

const flushPromises = () => {
  return new Promise(resolve => {
    setTimeout(resolve, 0)
  })
}
test('calls onSubmit with the username and password when submitted', async () => {
  const container = document.createElement('div')
  const fakeUser = {id: 'foobar'}
  const fakeHistory = {
    push: jest.fn(),
  }
  ReactDOM.render(<Editor user={fakeUser} history={fakeHistory} />, container)
  const form = container.querySelector('form')
  const {title, content, tags} = form.elements
  title.value = 'react is awesome'
  content.value = 'Like a lot ...sorta'
  tags.value = 'awesome,    lib , javascript'
  const submit = new Event('submit')
  form.dispatchEvent(submit)
  await flushPromises()
  expect(fakeHistory.push).toHaveBeenCalledTimes(1)
  expect(fakeHistory.push).toHaveBeenCalledWith('/')
  expect(utilsMock.posts.create).toHaveBeenCalledTimes(1)
  expect(utilsMock.posts.create).toHaveBeenCalledWith({
    authorId: fakeUser.id,
    title: title.value,
    content: content.value,
    tags: ['awesome', 'lib', 'javascript'],
    date: expect.any(String),
  })
})

// TODO later...
test('snapshot', () => {})
