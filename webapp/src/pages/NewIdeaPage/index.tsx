import { useState } from 'react'
import { Segment } from '../../components/Segment'

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
        <div style={{ marginBottom: 10 }}>
          <label htmlFor="name">Name</label>
          <br />
          <input
            type="text"
            onChange={(e) => {
              setState({ ...state, name: e.target.value })
            }}
            value={state.name}
            name="name"
            id="name"
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label htmlFor="nick">Nick</label>
          <br />
          <input
            type="text"
            onChange={(e) => {
              setState({ ...state, nick: e.target.value })
            }}
            value={state.nick}
            name="nick"
            id="nick"
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label htmlFor="description">Description</label>
          <br />
          <input
            type="text"
            onChange={(e) => {
              setState({ ...state, description: e.target.value })
            }}
            value={state.description}
            name="description"
            id="description"
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label htmlFor="text">Text</label>
          <br />
          <textarea
            onChange={(e) => {
              setState({ ...state, text: e.target.value })
            }}
            value={state.text}
            name="text"
            id="text"
          />
        </div>

        <button type="submit">Create Idea</button>
      </form>
    </Segment>
  )
}
