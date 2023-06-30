import { component$ } from '@builder.io/qwik';
import { Form, globalAction$, z, zod$ } from '@builder.io/qwik-city';
import { updateAuthCookies } from '~/server/auth/auth';
import { createSupabase } from '~/server/auth/supabase';
import { useAnonymousRoute } from '../layout';

export const useSignUpAction = globalAction$(
	async (data, event) => {
		const supabase = createSupabase(event);
		const response = await supabase.auth.signUp({ ...data });

		if (response.error) {
			const status = response.error.status || 400;
			return event.fail(status, {
				formErrors: [response.error.message],
			});
		}

		const signInResponse = await supabase.auth.signInWithPassword(data);

		if (signInResponse.error || !signInResponse.data.session) {
			const status = signInResponse.error?.status || 400;
			return event.fail(status, {
				formErrors: [signInResponse.error?.message],
			});
		}

		updateAuthCookies(event, signInResponse.data.session);

		throw event.redirect(302, '/');
	},
	zod$({
		email: z.string().email(),
		password: z.string(),
	})
);

export default component$(() => {
	useAnonymousRoute();
	const signUp = useSignUpAction();

	return (
		<Form action={signUp}>
			<h2>Sign up with password</h2>

			<div>
				<label for='email'>
					<span>Email</span>
				</label>
				<input placeholder='Email' id='email' name='email' type='email' />
				<span>{signUp.value?.fieldErrors?.email?.[0]}</span>
			</div>

			<div>
				<label for='password'>
					<span>Password</span>
				</label>
				<input id='password' name='password' type='password' />
				<span>{signUp.value?.fieldErrors?.password?.[0]}</span>
			</div>

			<span>{signUp.value?.formErrors?.[0]}</span>
			<button type='submit'>Sign Up</button>
		</Form>
	);
});
