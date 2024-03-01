export const comp_socket_client = `
<div class="container">
    <div class="row">
        <div class="column circle">
            <div class="form">
                <div class="form-row">
                    <label>SocketUrl：</label>
                    <input id="input_socketUrl" type="text" value="http://127.0.0.1:1110" />
                </div>
                <div class="form-row">
                    <label>SocketPath：</label>
                    <input id="input_socketPath" type="text" value="/zhongjyuan.io" />
                </div>
                <div class="form-row">
                    <label>ClientId：</label>
                    <input id="input_clientId" type="text" value="940870777" />
                </div>
                <div class="form-row btn">
                    <button id="button_connect" type="button" class="button connect">连 接</button>
                    <button id="button_disconnect" type="button" class="button disconnect">断 连</button>
                </div>
            </div>
        </div>
        <div class="column circle">
            <div class="form">
                <div class="form-row-two">
                    <div id="serverEvent_container" class="bubbles"></div>
                </div>
                <div class="form-row">
                    <label>ServerEvent：</label>
                    <input id="input_serverEvent" type="text" value="request" />
                </div>
                <div class="form-row">
                    <label>Content：</label>
                    <textarea id="input_content" maxlength="1000" rows="5" cols="30" placeholder='action|reaction 二选一\naction：服务端事件\nreaction：客户端事件\ndata：事件数据'></textarea>
                </div>
                <div class="form-row btn">
                    <button id="button_send" type="button" class="button send">发 送</button>
                </div>
            </div>
        </div>
        <div class="column circle">
            <div class="form">
                <div class="form-row-two">
                    <div id="clentEvent_container" class="bubbles"></div>
                </div>
                <div class="form-row">
                    <label>ClentEvent：</label>
                    <input id="input_clentEvent" type="text" value="response" />
                </div>
                <div class="form-row btn">
                    <button id="button_subscribe" type="button" class="button subscribe">订 阅</button>
                    <button id="button_dissubscribe" type="button" class="button dissubscribe">解 约</button>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div id="issue" class="column circle console">
            <span class="system">发送消息列表:</span>
        </div>
        <div id="receive" class="column circle console">
            <span class="system">接收消息列表:</span>
        </div>
    </div>
</div>
`;
