// ** React Imports

import { useState } from 'react'

// ** Third Party Imports

import { EditorState } from 'draft-js'

// ** Component Import

import ReactDraftWysiwyg from 'src/@core/components/react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

const EditorControlled = () => {
  // ** State

  const [value, setValue] = useState(EditorState.createEmpty())

  return <ReactDraftWysiwyg editorState={value} onEditorStateChange={data => setValue(data)} />
}

export default EditorControlled
