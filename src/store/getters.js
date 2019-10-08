const getters = {
  device: state => state.app.device,
  accountId: state => state.user.accountId,
  name: state => state.user.name,
  avatarUrl: state => state.user.avatarUrl,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes
}

export default getters
