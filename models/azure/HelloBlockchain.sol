pragma solidity ^0.4.24;

import './WorkbenchBase.sol';

contract HelloBlockchain is WorkbenchBase('HelloBlockchain', 'HelloBlockchain') {

    //Set of States
    enum StateType { Request, Respond}

    //List of properties
    StateType public State;
    address public Requestor;
    address public Responder;

    string public RequestMessage;
    string public ResponseMessage;

    // constructor function
    constructor(string message) public
    {
        Requestor = msg.sender;
        RequestMessage = message;
        State = StateType.Request;

        // call ContractCreated() to create an instance of this workflow
        ContractCreated();
    }
}