'use strict'

const d = document
const $hamburger = d.querySelector('.hamburger ')
const $nav = d.querySelector('.nav')
const $form = d.getElementById('form')
const tryToSend = true
const $email = d.getElementById('email')
const $message = d.getElementById('message')
const $notifications = d.querySelector('.notifications')
const $preload = d.querySelector('.preload')
const $proyects = d.querySelector('.proyects')
const $statusForm = d.querySelector('.statusForm')

//Preloader
setTimeout(() => {
	$preload.style.opacity = 0
	setTimeout(() => {
		$preload.remove()
	}, 700)
}, 1000)

//Component Work
const works = work => {
	return `
		<article class="proyect" style="opacity:0;" >
			<div class="proyect-info" style="background-image: linear-gradient(
				90deg,
				rgba(0, 52, 89, 0.9) 0%,
				rgba(0, 52, 89, 0.9) 0%
			),
			url('${work.url_image}');">
			<p class="proyect-field">${work.topic}</p>
				<h3 class="proyect-title">${work.title}</h3>
				<p class="proyect-commets">
					${work.description}
				</p>
			<div class="proyect-stack">
					${work.stack.map(tech => `<span>${tech}</span>`).join(' ')}
			</div>
			<div class="proyect-icons">
				${
					work.url_repo
						? `<a href="${work.url_repo}" 	target="_blank" rel="noopener noferrer"><i class="fab fa-github"></i></a>`
						: ''
				}
				<a href="${
					work.url_live
				}" 	target="_blank" rel="noopener noferrer"><i class="fas fa-external-link-alt"></i></a>
			</div>
			</div>
			<a class="proyect-image" href="${
				work.url_live
			}" target="_blank"  rel="noopener noferrer">
				<img src="${work.url_image}" alt="${work.title}" srcset="" />
			</a>
		</article>
	`
}

//Fetching data(works)
fetch('./assets/data/works.json', {
	method: 'GET',
	headers: { 'Content-Type': 'application-json' },
})
	.then(res => res.json())
	.then(res => ($proyects.innerHTML += res.map(item => works(item)).join(' ')))
	.then(() => {
		const proyects = document.querySelectorAll('.proyect')
		proyects.forEach(proyect => observer.observe(proyect))
	})

const testEmail = () => {
	if (
		!/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(
			$email.value
		)
	) {
		$email.classList.add('inputError')
		return true
	} else {
		$email.classList.remove('inputError')
		return false
	}
}

const testMessage = () => {
	if ($message.value.length <= 0) {
		$message.classList.add('inputError')
		return true
	} else {
		$message.classList.remove('inputError')
		return false
	}
}

$form.addEventListener('submit', e => {
	e.preventDefault()
	let test1 = testMessage()
	let test2 = testEmail()

	if (test1 || test2) {
		let $notification = d.createElement('div')
		$notification.classList.add('notification')
		$notification.textContent = 'Fill in the fields correctly'
		$notifications.appendChild($notification)
		setTimeout(() => {
			$notification.style.opacity = '0'
		}, 2000)
		setTimeout(() => {
			$notification.remove()
		}, 2500)
		return null
	} else {
		const data = new FormData(e.target)
		$statusForm.innerHTML = `<img
		src="./assets/images/loader-form.gif"
		alt="Loader"
		width="50px"
		height="50px"
		/>`
		fetch(e.target.action, {
			method: e.target.method,
			body: data,
			headers: {
				Accept: 'application/json',
			},
		})
			.then(() => {
				$form.reset()
				$statusForm.innerHTML = `<p style="color: var(--third-color);">Form sent successfully, I'll be contacting you!</p>`
			})
			.catch(() => {
				$statusForm.innerHTML = `<p style="color: red;">There was an error sending, please try again later or try another contact method</p>`
			})
	}
})

d.addEventListener('click', e => {
	if (
		e.target.matches('.hamburger') ||
		e.target.matches('.hamburger-box') ||
		e.target.matches('.hamburger-inner') ||
		e.target.matches('.nav-mobil')
	) {
		$hamburger.classList.toggle('is-active')
		$nav.classList.toggle('nav-active')
	}
})

d.addEventListener('input', e => {
	if (e.target.matches('#email')) {
		testEmail()
	}
	if (e.target.matches('#message')) {
		testMessage()
	}
})

//Create intersection observer
function buildThresholdList() {
	let thresholds = []
	let numSteps = 99

	for (let i = 0; i <= numSteps; i++) {
		let ratio = parseFloat(`0.${i}`)
		thresholds.push(ratio)
	}

	thresholds.push(1)
	return thresholds
}
let options = {
	threshold: buildThresholdList(),
	rootMargin: '10px 0px',
}
let defaultTranslate = -200
const callback = (entries, observer) => {
	entries.forEach(entry => {
		let toTranslate = parseInt(entry.intersectionRatio * 100 * 2)
		if (entry.isIntersecting) {
			entry.target.style.opacity = `${entry.intersectionRatio}`
			let defineTranslate = defaultTranslate + toTranslate
			entry.target.style.transform = `translateX(${defineTranslate}px)`
		}
	})
}
let observer = new IntersectionObserver(callback, options)

//Another intersection observer
let optionsFade = {
	threshold: 0.2,
	rootMargin: '50px 0px',
}

const fade = (entries, observer) => {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			entry.target.classList.add('animate__fadeInUp')
		}
	})
}

let observerFade = new IntersectionObserver(fade, optionsFade)
const targetFade = d.querySelectorAll('.fade-animation')
targetFade.forEach(element => {
	observerFade.observe(element)
})
