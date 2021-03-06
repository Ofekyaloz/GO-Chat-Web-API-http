import {useRef} from "react";
import {wait} from "@testing-library/user-event/dist/utils";
import {click} from "@testing-library/user-event/dist/click";
import {localhost} from "../App";
import $ from "jquery";

function NewContactModal({setContactsList, thisUser, token}) {
    const newContactUsername = useRef(null);
    const newContactNickname = useRef(null);
    const newContactServer = useRef(null);

    const HandlePress = function (e) {
        if (e.key === "Enter" && newContactUsername.current.value !== '' &&
            newContactNickname.current.value !== '' && newContactServer.current.value !== '') {
            AddContact();
        }
    }

    const AddContact = function () {

        let id = newContactUsername.current.value;
        let name = newContactNickname.current.value;
        let server = newContactServer.current.value;
        const url = localhost + 'api/Contacts'
        $.ajax({
            url: url,
            type: 'POST',
            contentType: "application/json",
            data: JSON.stringify({
                "id": id,
                "name": name,
                "server": server
            }),
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + token)
            },
            success: function () {
                $.ajax({
                    url: url,
                    type: 'GET',
                    contentType: "application/json",
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader('Authorization', 'Bearer ' + token)
                    },
                    success: function(data) {
                        setContactsList(data)
                    }
                })
                document.getElementById("CloseSearch").click();
                wait(100).then(() => click(document.getElementById(id)));
            },
            error: function () {
                document.getElementById("not-found").style.display = 'block';
            }
        })


        //invite
        const url2 = server.endsWith('/') ?'https://' +  server + 'api/invitations' : 'https://' + server + '/api/invitations';
        $.ajax({
            url: url2,
            type: 'POST',
            contentType: "application/json",
            data: JSON.stringify({"from": thisUser, "to": id, "server": localhost})
        })
    }

    const Close = function () {
        document.getElementById("not-found").style.display = 'none';
        document.getElementById("newContactUsername").value = '';
        document.getElementById("newContactNickname").value = '';
        document.getElementById("newContactServer").value = '';
    }

    return (
        <div className="modal fade" id="Modal-new-contact" tabIndex="-1" aria-labelledby="add-file"
             aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title"> New Chat </h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"
                                onClick={Close}/>
                    </div>
                    <div className="modal-body">
                        <input ref={newContactUsername} type="text" className="form-control SearchContact"
                               autoComplete="off"
                               id="newContactUsername" placeholder="Username" maxLength={35} onKeyPress={HandlePress}>
                        </input>

                        <input ref={newContactNickname} type="text" className="form-control SearchContact"
                               autoComplete="off"
                               id="newContactNickname" placeholder="Nickname" maxLength={35} onKeyPress={HandlePress}>
                        </input>

                        <input ref={newContactServer} type="text" className="form-control SearchContact"
                               autoComplete="off"
                               id="newContactServer" placeholder="Server: localhost:xxxx" maxLength={35} onKeyPress={HandlePress}>
                        </input>

                        <div id="not-found" className="alert alert-danger align-items-center" role="alert">
                            <div>
                                <i className="bi bi-exclamation-circle m-3"/> Incorrect username.
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-danger" data-bs-dismiss="modal" id="CloseSearch"
                                onClick={Close}>
                            Close
                        </button>
                        <button type="button" className="btn btn-primary ms-auto" onClick={AddContact}>
                            Add
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NewContactModal;