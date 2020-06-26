import React, { Component } from 'react';
import { EditorState, ContentState, convertToRaw,convertFromRaw } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import {Card} from 'react-bootstrap';

import createMentionPlugin, { defaultSuggestionsFilter } from 'draft-js-mention-plugin';
import createMathjaxPlugin from 'fixed-draft-js-mathjax-plugin';


import {stateToHTML} from 'draft-js-export-html';


import './../css/test.css';

import editorStyles from './../css/editorStyles.css';
import 'draft-js-mention-plugin/lib/plugin.css';

export default class EditInstruction extends Component {

    constructor(props) {
        super(props);
        const inputs = [];

        this.mentionPlugin = createMentionPlugin({
            inputs,
            entityMutability: 'IMMUTABLE',
            mentionPrefix: '@'
        });

        this.state = {
            editorState: this.props.text?EditorState.createWithContent(convertFromRaw(JSON.parse(this.props.text))):EditorState.createEmpty(),
            //editorState: EditorState.createEmpty(),
            suggestions: [],
            subSuggestion: [],
            plugins:[this.mentionPlugin,createMathjaxPlugin({setReadOnly:this.props.isReadOnly})],
            isReadOnly:this.props.isReadOnly
        };

    }

    onChange = (editorState) => {
        //console.log(JSON.stringify(convertToRaw(editorState.getCurrentContent())));
        //console.log(stateToHTML(this.state.editorState.getCurrentContent()));

        this.setState({
            editorState,
        });
    };

    onSearchChange = ({ value }) => {
        this.setState({
            subSuggestion: defaultSuggestionsFilter(value, this.state.suggestions),
        });
    };

    focus = () => {
        if(!this.state.isReadOnly)
            this.editor.focus();
    };

    setInputs(inputs){
        this.setState({
            suggestions:inputs,
            subSuggestion:inputs
        })
    }

    getInstructions()
    {
        console.log(stateToHTML(this.state.editorState.getCurrentContent()));
        return JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent()));
    }


    render() {
        const { MentionSuggestions } = this.mentionPlugin;

        return (
            <Card className="mx-auto">
                <Card.Body>
                    <Card.Title>Instruction</Card.Title>
                    <span >Use <span style={{color:'#2686ff'}}>@</span> to mention an input, and use <span style={{color:'#2686ff'}}>$</span> key to insert inline math. <a href="https://math.meta.stackexchange.com/questions/5020/mathjax-basic-tutorial-and-quick-reference">(See MathJax basic)</a></span>
                    <hr></hr>
                        <div className={editorStyles.editor} onClick={this.focus}>
                            <Editor
                                readOnly={this.state.isReadOnly}
                                editorState={this.state.editorState}
                                onChange={this.onChange}
                                plugins={this.state.plugins}
                                ref={(element) => { this.editor = element; }}
                            />
                            <MentionSuggestions
                                onSearchChange={this.onSearchChange}
                                suggestions={this.state.subSuggestion}
                            />
                        </div>
                </Card.Body>
            </Card>
        );
    }
}
