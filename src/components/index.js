import React, { Component } from "react";
import initialData from "../model";
import MD5 from "../utils";
import "../stylesheets/main.scss";

const ButtonTab = ({ active, onClick }) =>
<center>
  <div data-tab="1" className={active == 1 ? "tab active inline" : "tab inline"} onClick={onClick}>Всплывающий<br />фрейм</div>
  <div data-tab="2" className={active == 2 ? "tab active inline" : "tab inline"} onClick={onClick}>Встроенный<br />фрейм</div>
</center>

const ButtonSubmit = ({ value, show }) =>
show ?
<center>
  <button className="btn" type="submit">{value}</button>
</center> : false

const Input = ({ index, name, placeholder, onChange }) => <input type="text" data-index={index} name={name} placeholder={placeholder} onChange={onChange} />;

const Card = ({ show, onChange }) =>
show ?
  <div className="card center">
    <div className="icon fright">VISA</div>
    <label>Номер карты:</label>
    <Input name="pan" placeholder="4111111111111111" onChange={onChange} />
    <div className="inline">
      <label>Срок действия:</label>
      <Input name="expire" placeholder="10/17" onChange={onChange} />
    </div>
    <div className="inline">
      <label>CVC/CVV:<span className="icon fright">?</span></label>
      <Input name="cvv" placeholder="123" onChange={onChange} />
    </div>
  </div> : false

const ParentId = ({method}) => <div className="tabspace-2">{ method == "set" ? <span>parent_id: "iframe_parent",</span> : false }</div>

const Snippet = ({method, data, onClick}) =>
  <div className="code inline">
    <span className="icon-copy fright" onClick={onClick}>copy</span>{
    <code>
      <div>&lsaquo;script src="https://paymo.ru/paymentgate/iframe/checkout.js">&lsaquo;/script&rsaquo;</div>
      <div>&lsaquo;script&rsaquo;</div>
      <div className="tabspace-1">PaymoFrame.<span className="highlight">{method}</span>(&#123;</div>
      <ParentId method={method}/>
      <div className="tabspace-2">api_key: "<span className="highlight">{data[0].value}</span>",</div>
      <div className="tabspace-2">tx_id: "<span className="highlight">{data[1].value}</span>",</div>
      <div className="tabspace-2">description: "<span className="highlight">{data[2].value}</span>",</div>
      <div className="tabspace-2">amount: <span className="highlight">{data[3].value}</span>,</div>
      <div className="tabspace-2">signature: "<span className="highlight">{data[6].value}</span>",</div>
      <div className="tabspace-2">success_redirect: "<span className="highlight">{data[4].value}</span>",</div>
      <div className="tabspace-2">fail_redirect: "<span className="highlight">{data[5].value}</span>",</div>
      <div className="tabspace-2">rebill: &#123;&#125;,</div>
      <div className="tabspace-2">extra: &#123;&#125;,</div>
      <div className="tabspace-2">version: "2.0.0"</div>
      <div className="tabspace-1">&#125;)</div>
      &lsaquo;/script&rsaquo;
      <br /><br />
      &lsaquo;div id="iframe_parent"&rsaquo;
      <br />
      &lsaquo;/div&rsaquo;
    </code>}
  </div>

const Loader = ({show, pan, expire, cvv}) => show ?
  <div className="loader">
    <center>
      <p className="highlight">Ожидание оплаты...</p>
      <p>
        <code>
          curl -X POST -H 'Content-Type: application/json' -H 'X-Sign: {MD5(pan+expire+cvv)}' -d '&#123;"pan":{pan},"expire":{expire},"cvv":{cvv}&#125;' https://paymo.ru/paymentgate
        </code>
      </p>
    </center>
  </div> : false

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: initialData,
      dataCard: [],
      activeTab: 1,
      method: "set",
      showCard: false,
      showRequest: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmitRequest = this.handleSubmitRequest.bind(this);
    this.handleTabClick = this.handleTabClick.bind(this);
    this.handleCopyClick = this.handleCopyClick.bind(this);
  }

  handleChange(e) {
    if (e.target.hasAttribute("data-index")) {
      const data = this.state.data;
      data[e.target.getAttribute("data-index")].value = e.target.value;
      this.setState({ data });
    }
    const dataCard = this.state.dataCard;
    switch (e.target.name) {
        case "pan": dataCard[0] = e.target.value; break;
        case "expire": dataCard[1] = e.target.value; break;
        case "cvv": dataCard[2] = e.target.value; break;
    }
    this.setState({ dataCard });
    !e.target.value.length ? e.target.style.border = "1px solid red" : e.target.style.border = ""
  }

  handleSubmit(e) {
    e.preventDefault();
    const isTrue = this.state.data.some (
      el => !el.value.length
    )
    this.setState({showCard: !isTrue});
  }

  handleSubmitRequest(e) {
    e.preventDefault();
    const isTrue = this.state.dataCard.length < 3;
    this.setState({showCard: isTrue, showRequest: !isTrue});

  }

  handleTabClick(e) {
    const tab = +e.target.getAttribute("data-tab");
    this.setState({activeTab: tab})
    switch (tab) {
      case 1: this.setState({method: "set"}); break;
      case 2: this.setState({method: "open"}); break;
    }
  }

  handleCopyClick() {
    alert("handleCopyClick")
  }

  render() {
    const Fields = this.state.data.map (
        (el,index) => <div><label>{el.label}</label><Input index={index} name={el.id} placeholder={el.value} onChange={this.handleChange} /></div>
    );
    return (
      <form name="frame" method="post" className="frames" onSubmit={this.state.showCard ? this.handleSubmitRequest : this.handleSubmit}>
        <ButtonTab onClick={this.handleTabClick} active={this.state.activeTab} />
        <div>
          <div className="fields inline">
            {Fields}
          </div>
          <Snippet method={this.state.method} data={this.state.data} onClick={this.handleCopyClick} />
        </div>
        <div>
          <Card show={this.state.showCard} onChange={this.handleChange} />
        </div>
        <Loader show={this.state.showRequest} pan={this.state.dataCard[0]} expire={this.state.dataCard[1]} cvv={this.state.dataCard[2]} />
        <ButtonSubmit value={this.state.showCard ? "Оплатить" : "Вызвать фрейм"} show={!this.state.showRequest} />
      </form>
    );
  }
}
