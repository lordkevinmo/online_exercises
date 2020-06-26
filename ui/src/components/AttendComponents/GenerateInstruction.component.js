import React, { Component } from 'react';
import {EditorState, convertFromRaw} from 'draft-js';
import Editor from 'draft-js-plugins-editor';

import createMathjaxPlugin from 'fixed-draft-js-mathjax-plugin';
import createMentionPlugin from 'draft-js-mention-plugin';


function setValueInInstruction(instruction,inputs,values)
{
    instruction.blocks.forEach((block,i) => {

        //console.log('Block['+i+'] "' + block.text + '"');

        let offsetChange = 0;

        block.entityRanges.forEach((entity) => {

            entity.offset+=offsetChange;
            //console.log('\n[Entity] offsetChange:' + offsetChange);

            inputs.forEach(input => {

                if(instruction.entityMap[entity.key].type === 'mention') {
                    if(input.name === instruction.entityMap[entity.key].data.mention.name)
                    {

                        //console.log('replace ' + entity.offset + ' ' + entity.length + ' ' + block.text.toString().substr(entity.offset,entity.length));

                        block.text = block.text.toString().replace(block.text.toString().substr(entity.offset,entity.length),values[input.index])

                        let newLength = values[input.index].toString().length
                        //console.log('newLength:' +newLength);

                        offsetChange+= (newLength-entity.length);
                        entity.length=newLength;


                    }
                }

            });

        });


    });

    //console.log('\nResult:');
    //console.log(JSON.stringify(instruction))
    return instruction;
}

function replaceInTeX(instructions,inputs,values,trigger) {
    let instruction = instructions;
    inputs.forEach((item,i) => {
        instruction = replaceAll(instruction,trigger + item.name,values[item.index])
    });
    return instruction;
}

function replaceAll(string, search, replace) {
    return string.split(search).join(replace);
}

export default class GenerateInstructionComponent extends Component {

    constructor(props) {
        super(props);

        this.setupUsingProp = this.setupUsingProp.bind(this);

        this.mentionPlugin = createMentionPlugin({
            entityMutability: 'IMMUTABLE',
            mentionPrefix: '@'
        });

        if(this.props.instruction)
        {
            this.state = {
                plugins:[this.mentionPlugin,createMathjaxPlugin({setReadOnly:this.props.isReadOnly})],
                trigger:this.props.trigger,
            };
            this.setupUsingProp();
        }
        else
        {
            this.state = {
                editorState: EditorState.createEmpty(),
                plugins:[this.mentionPlugin,createMathjaxPlugin({setReadOnly:this.props.isReadOnly})],
                trigger:this.props.trigger,
            };
        }

    }



    setupUsingProp() {
        if(!this.props.instruction)
            return;

        let JSONContentState = JSON.parse(this.props.instruction);
        let inputs = this.props.inputs;
        let values = this.props.values;

        //console.log('Printing props:');
        //console.log(JSONContentState);
        //console.log(inputs);
        //console.log(values);

        //We sort the array by length to avoid conflict between #AB by #A.
        inputs.sort(function(a, b) {
            return b.name.length - a.name.length || // sort by length, if equal then
                b.name.localeCompare(a.name);    // sort by dictionary order
        });

        //Replace in Raw contentState
        JSONContentState = setValueInInstruction(JSONContentState,inputs,values);

        //we ONLY replace the element in the entityMap because that's where the MathJax are stored
        JSONContentState.entityMap = JSON.parse(replaceInTeX(JSON.stringify(JSONContentState.entityMap),inputs,values,this.props.trigger));

        if(this.state.editorState)
        {
            const editorState = EditorState.push(this.state.editorState, convertFromRaw(JSONContentState));

            this.setState({
                editorState: editorState,
                inputs:inputs,
                values:values,
            });
        }
        else
        {
            this.state = {
                editorState: EditorState.createWithContent(convertFromRaw(JSONContentState)),
                plugins: this.state.plugins,
                trigger: this.props.trigger,
                inputs: inputs,
                values: values,
            };
        }


    }

    componentDidMount() {
        //console.log('componentDidMount Generate Instruction');

    }

    onChange = (editorState) => {
        this.setState({
            editorState:editorState,
        })
    };

    onRefresh() {
        this.setupUsingProp();
    }

    render() {
        return (
            <div>
                <Editor
                    readOnly={true}
                    editorState={this.state.editorState}
                    plugins={this.state.plugins}
                    onChange={this.onChange}
                />
            </div>
        );
    }
}
