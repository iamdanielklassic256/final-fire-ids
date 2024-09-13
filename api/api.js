// const akiba_api_url = 'http://localhost:3000'
const akiba_api_url = 'https://akiba-sacco-api.onrender.com'


//MEMBERS API ONLY
export const login_url = `${akiba_api_url}/auth/login`
export const sign_up_url = `${akiba_api_url}/auth/signup` 
export const all_members_url = `${akiba_api_url}/members`


//ROLES
export const role_url = `${akiba_api_url}/roles`


//GROUP SAVING CYCLE API
export const saving_cycle_url = `${akiba_api_url}/saving_cycles`
export const member_saving_cycle_url = `${akiba_api_url}/saving_cycles/member`


//CONTRIBUTION FREQUENCIES API
export const contrib_freq_url = `${akiba_api_url}/contribution-frequency`
export const member_contrib_freq_url = `${akiba_api_url}/contribution-frequency/member`


//SAVING GROUP API
export const saving_group_url = `${akiba_api_url}/saving_groups`
export const member_saving_group_url = `${akiba_api_url}/saving_groups/member`
export const all_savings_groups_by_member_id = `${akiba_api_url}/saving_groups/all-groups-by-member`

//SAVIG GROUP MEMBERS
export const saving_group_members_url = `${akiba_api_url}/saving_group_members`
export const all_members_in_a_group = `${akiba_api_url}/saving_group_members/group`

//GROUP WALLET API
export const group_wallet_url = `${akiba_api_url}/group-wallet`
export const member_group_wallet_url = `${akiba_api_url}/group-wallet/member`

//GROUP WALLET TYPE API
export const group_wallet_type_url = `${akiba_api_url}/wallet_type`
export const member_group_wallet_type_url = `${akiba_api_url}/wallet_type/member`


//GROUP TRANSACTIONS
export const group_transaction_url = `${akiba_api_url}/group-transactions`
export const member_transaction_url = `${akiba_api_url}/group-transactions/member`




