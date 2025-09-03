import React from 'react'

const EditPostHOC = OriginalComponent => {
	class NewComponent extends React.Component {
		constructor(props) {
			this.state = {
				happy:"Yahoo"
			}
		}
	
		render(){
			return <OriginalComponent happy={this.state.happy} name="Vishwas" />		
		}	
	}
	return NewComponent
}

export default EditPostHOC