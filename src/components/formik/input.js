import { Field } from "formik";
import React from "react";
import { Input as ReactInput } from "reactstrap";

const Input = ({ name, type, placeholder }) => {
	return (
		<Field name={name}>
			{({ field, form: { touched, errors, isValid }, meta }) => {
				return (
					<div className="w-100 position-relative mb-3">
						<ReactInput
							type={type}
							className="w-100"
							placeholder={placeholder}
							{...field}

							// valid={isValid}
							// invalid={!isValid}
						/>
						{meta.touched && meta.error && (
							<small
								style={{
									color: "#dc3545",
								}}
								className="error position-absolute mt-1"
							>
								{meta.error}
							</small>
						)}
					</div>
				);
			}}
		</Field>
	);
};

export default Input;
