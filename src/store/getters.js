const getters = {
  device: state => state.app.device,
  accountId: state => state.user.accountId,
  name: state => state.user.name,
  avatar: state => state.user.avatar,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes
}

export default getters
