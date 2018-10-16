pragma solidity ^0.4.18;
contract Diagnosis {

    event patientcancel();
    event doctoridentify();
    event patientaccomplish();

    address public Patient;
    address public Doctor;

    enum State { Issued, Identified, Accomplished, Canceled}
    State public state;

    struct UserInfo {
	string name;
	string sex;
	string age;
	string illness;
	string diagnosis;
    }

    UserInfo userinfo = UserInfo('','','','','');    

    constructor(string _name, string _sex, string _age, string _illness) public {
        userinfo.name = _name;
	userinfo.sex = _sex;
	userinfo.age = _age;
	userinfo.illness = _illness;
	Patient = msg.sender;
	state = State.Issued;
    }

    modifier onlyPatient(){
	require(
	    msg.sender == Patient,
            "Only patient can call this."
	);
        _;
    }

    modifier onlyDoctor(){
	require(
	    msg.sender == Doctor,
            "Only doctor can call this."
	);
	_;
    }

    modifier inState(State _state){
	require(
	    state == _state,
	    "Invalid state."
	);
	_;
    }
    

    function PatientCancel() public onlyPatient inState(State.Issued){
	state = State.Canceled;
    	emit patientcancel();
    }


    function update (string _diagnosis) public onlyDoctor {
	require(msg.sender == Doctor);
        userinfo.diagnosis = _diagnosis;
    }

    function DoctorIdentify() public inState(State.Issued){
	state = State.Identified;
	Doctor = msg.sender;
        emit doctoridentify();
    }

    function PatientAccomplish() public onlyPatient inState(State.Identified){
	state = State.Accomplished;
	emit patientaccomplish();
    }

    function say() constant public returns (string name, string sex, string age, string illness, string diagnosis) {
        return (userinfo.name, userinfo.sex, userinfo.age, userinfo.illness, userinfo.diagnosis);
    }
}


