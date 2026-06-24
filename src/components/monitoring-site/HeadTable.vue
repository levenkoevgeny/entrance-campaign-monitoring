<script>
export default {
	name: 'HeadTable',
	props: {
		date: {
			type: String,
			default: '',
		},
		time: {
			type: String,
			default: '',
		},
		head: {
			type: Object,
			default: () => {},
		},
		isFp: {
			type: Boolean,
			default: false,
		},
	},
}
</script>

<template>
	<div class="header__list">
		<h2 style="align-self: center">
			<strong>ИНФОРМАЦИЯ О ХОДЕ ПРИЕМА ДОКУМЕНТОВ</strong>
		</h2>
		<div class="head__text mt-5">
			<div>
				<h2 v-if="!isFp">Форма получения образования {{ head.education_form }}</h2>
				<h2>Прием осуществляется {{ head.education_term }}</h2>
				<h2>Прием осуществляется {{ head.budget }}</h2>
			</div>
			<table
				class="table table-bordered text-center"
				style="width: 20%">
				<thead>
					<tr>
						<td><strong style="font-size: 25px">Дата</strong></td>
						<td><strong style="font-size: 25px">Время</strong></td>
					</tr>
				</thead>
				<tbody>
					<tr style="vertical-align: middle">
						<td>
							<strong style="font-size: 25px">{{ date }}</strong>
						</td>
						<td>
							<strong style="font-size: 40px">{{ time }}</strong>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<style scoped>
.header__list {
	display: flex;
	flex-direction: column;
}
.head__text {
	display: flex;
	justify-content: space-between;
}

@media (max-width: 600px) {
	.head__text {
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1.5em;
	}
}
</style>
