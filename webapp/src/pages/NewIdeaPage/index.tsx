import { useState } from 'react'
import { Input } from '../../components/Input'
import { Segment } from '../../components/Segment'
import { Textarea } from '../../components/Textarea'

export const NewIdeaPage = () => {
  const [state, setState] = useState({
    name: '',
    nick: '',
    description: '',
    text: '',
  })

  return (
    <Segment title="New Idea">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          console.info('Submitted', state)
        }}
      >
        <Input name="name" label="Name" state={state} setState={setState} />
        <Input name="nick" label="Nick" state={state} setState={setState} />
        <Input name="description" label="Description" state={state} setState={setState} />
        <Textarea name="text" label="Text" state={state} setState={setState} />
        <button type="submit">Create Idea</button>
      </form>
    </Segment>
  )
}
