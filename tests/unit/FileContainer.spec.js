import { FileContainer } from '../../src/index'


test('setId', () => {
  const tmpfileContainer = new FileContainer()
  tmpfileContainer.setId('1')
  expect(tmpfileContainer.getId()).toBe('1')
});

test('setProjectName', () => {
  const tmpfileContainer = new FileContainer()
  tmpfileContainer.setProjectName('projectName')
  expect(tmpfileContainer.getProjectName()).toBe('projectName')
});