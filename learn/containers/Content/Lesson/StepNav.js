import Router from 'next/router'
import StepNav from '~/components/Content/Lesson/StepNav'
import Lesson from './'
import Profile from '~/containers/Profile'
import * as userActions from '~/actions/user'
import WithActions from '~/lib/with-actions'

export default WithActions((env, props, changeProps) => ({
  onNext: async (nextStep) => {
    const { lokkaClient } = env
    const { courseId, lessonId } = props
    changeProps({ loading: true })

    // Do the mutation
    if (!nextStep.visited) {
      try {
        await lokkaClient.mutate(`
          {
            markVisited(
              courseId: "${courseId}"
              lessonId: "${lessonId}"
              stepId: "${nextStep.id}"
            )
          }
        `)
      } catch (error) {
        changeProps({ loading: false, error })
        return
      }

      // Update the local cache for the changes in the mutation
      Lesson.updateCache({ courseId, lessonId }, (item) => {
        const step = item.course.lessons[0].steps.find((s) => s.id === nextStep.id)
        step.visited = true

        return item
      })

      // Update the local cache for points
      Profile.updateCache({}, (item) => {
        if (nextStep.type === 'text') {
          item.user.points += nextStep.points
        }

        return item
      })
    }

    // Change the route
    changeProps({ loading: false })
    const as = `/learn/${courseId}/${lessonId}/${nextStep.id}`
    const href = `/learn/content?course=${courseId}&lesson=${lessonId}&step=${nextStep.id}`
    await changeRoute(href, as)
  },

  onPrev: async (prevStep) => {
    const { courseId, lessonId } = props
    let as = `/learn/${courseId}/${lessonId}`
    let href = `/learn/content?course=${courseId}&lesson=${lessonId}`

    if (prevStep) {
      as = `${as}/${prevStep.id}`
      href = `${href}&step=${prevStep.id}`
    }

    await changeRoute(href, as)
  },

  onLogin: () => {
    userActions.login()
  }
}))(StepNav)

async function changeRoute(href, as) {
  await Router.push(href, as)
  window.scrollTo(0, 0)
}
