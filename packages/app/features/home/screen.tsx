'use client'

import {
  Button,
  H1,
  Input,
  Paragraph,
  Separator,
  Spinner,
  Text,
  YStack,
  XStack,
  Anchor,
  Select,
  Adapt,
  Sheet,
} from 'tamagui'
import { gql, useMutation, useQuery } from '@apollo/client'
import { useState, useEffect } from 'react' // Added useEffect
import { Check, ChevronDown, ChevronUp } from '@tamagui/lucide-icons'

// GraphQL Query: fetch all users for dropdown
const GET_ALL_USERS_QUERY = gql`
  query GetAllUsers {
    allUsers {
      id
      userName
    }
  }
`

// GraphQL Query: fetch user data + transactions
const GET_USER_QUERY = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      userName
      currentBalance
      transactions {
        id
        amount
        timestamp
        sender {
          id
          userName
        }
        receiver {
          id
          userName
        }
      }
    }
  }
`

// GraphQL Mutation: transfer money
const SEND_MONEY_MUTATION = gql`
  mutation SendMoney($fromUserId: ID!, $toUserId: ID!, $amount: Float!) {
    sendMoney(fromUserId: $fromUserId, toUserId: $toUserId, amount: $amount) {
      ok
      message
      transaction {
        id
        amount
        timestamp
        sender {
          id
          userName
        }
        receiver {
          id
          userName
        }
      }
    }
  }
`

// Skeleton Loading Components
const SkeletonBox = ({ height = 20, width = '100%' }) => (
  <YStack
    height={height}
    width={width}
    backgroundColor="#E5E7EB"
    borderRadius={8}
    animation="slow"
    animateOnly={['opacity']}
    opacity={0.6}
  />
)

const TransactionSkeleton = () => (
  <YStack
    p="$4"
    borderWidth={1}
    borderColor="#D1D5DB"
    borderRadius={16}
    backgroundColor="#F9FAFB"
    space="$3"
  >
    <SkeletonBox height={16} width="60%" />
    <XStack justifyContent="space-between" alignItems="center">
      <SkeletonBox height={14} width="30%" />
      <SkeletonBox height={14} width="25%" />
    </XStack>
    <XStack justifyContent="space-between" alignItems="center">
      <SkeletonBox height={14} width="20%" />
      <SkeletonBox height={14} width="35%" />
    </XStack>
  </YStack>
)

const WalletSkeleton = () => (
  <YStack f={1} jc="flex-start" ai="center" p="$4" space="$4">
    <YStack space="$4" maw={700} w="100%" ai="center">
      <SkeletonBox height={32} width="60%" />
      <SkeletonBox height={20} width="40%" />
      <SkeletonBox height={28} width="50%" />
    </YStack>

    <YStack w="100%" space="$4" maw={600} py="$4">
      <SkeletonBox height={18} width="30%" />
      <SkeletonBox height={48} />
      <SkeletonBox height={48} />
      <SkeletonBox height={48} />
    </YStack>

    <YStack w="100%" space="$3" maw={700} pt="$4">
      <SkeletonBox height={18} width="40%" />
      {[1, 2, 3].map((i) => (
        <TransactionSkeleton key={i} />
      ))}
    </YStack>
  </YStack>
)

export function HomeScreen() {
  const [selectedUserId, setSelectedUserId] = useState('')
  const [recipientId, setRecipientId] = useState('')
  const [amount, setAmount] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  // Fetch all users for dropdown
  const { data: usersData, loading: usersLoading } = useQuery(GET_ALL_USERS_QUERY)

  // Fetch selected user data
  const { data, loading, error, refetch } = useQuery(GET_USER_QUERY, {
    variables: { id: selectedUserId },
    skip: !selectedUserId,
    fetchPolicy: 'cache-and-network',
  })

  // Added useEffect to reset recipient when user changes
  useEffect(() => {
    setRecipientId('')
    setAmount('')
    setSuccessMsg('')
    setErrorMsg('')
  }, [selectedUserId])

  const [sendMoney, { loading: sending }] = useMutation(SEND_MONEY_MUTATION, {
    onCompleted(data) {
      if (data.sendMoney.ok) {
        setSuccessMsg(data.sendMoney.message)
        setErrorMsg('')
        setRecipientId('')
        setAmount('')
        refetch()
      } else {
        setErrorMsg(data.sendMoney.message)
        setSuccessMsg('')
      }
    },
    onError(err) {
      setErrorMsg(err.message)
      setSuccessMsg('')
    },
  })

  const handleSend = () => {
    const amt = parseFloat(amount)
    if (!recipientId || isNaN(amt) || amt <= 0) {
      setErrorMsg('Enter a valid recipient and amount.')
      return
    }

    if (recipientId === selectedUserId) {
      setErrorMsg('Cannot send money to yourself')
      return
    }

    sendMoney({
      variables: {
        fromUserId: selectedUserId,
        toUserId: recipientId,
        amount: amt,
      },
    })
  }

  // Show skeleton while loading users initially
  if (usersLoading) {
    return <WalletSkeleton />
  }

  if (error)
    return (
      <YStack f={1} jc="center" ai="center" p="$4">
        <Text color="#DC2626" fontSize="$5" textAlign="center">
          Error loading wallet: {error.message}
        </Text>
      </YStack>
    )

  // Changed from usersData.users to usersData.allUsers
  const users = usersData?.allUsers || [] // Fixed this line
  const user = data?.user

  // Show user selection if no user is selected
  if (!selectedUserId) {
    return (
      <YStack f={1} jc="center" ai="center" p="$4" space="$4">
        <YStack space="$4" maw={400} w="100%" ai="center">
          <H1 ta="center" color="#1D4ED8">
            P2P Digital Wallet
          </H1>
          <Paragraph ta="center" color="#6B7280" fontSize="$5">
            Select your account to continue
          </Paragraph>

          <YStack w="100%" space="$3">
            <Text fontWeight="600" fontSize="$4">
              Choose User Account:
            </Text>
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <Select.Trigger w="100%" iconAfter={ChevronDown} size="$5">
                <Select.Value placeholder="Select a user..." />
              </Select.Trigger>

              <Adapt when="sm" platform="touch">
                <Sheet modal dismissOnSnapToBottom>
                  <Sheet.Frame>
                    <Sheet.ScrollView>
                      <Adapt.Contents />
                    </Sheet.ScrollView>
                  </Sheet.Frame>
                  <Sheet.Overlay />
                </Sheet>
              </Adapt>

              <Select.Content zIndex={200000}>
                <Select.ScrollUpButton
                  alignItems="center"
                  justifyContent="center"
                  position="relative"
                  width="100%"
                  height="$3"
                >
                  <YStack zIndex={10}>
                    <ChevronUp size={20} />
                  </YStack>
                </Select.ScrollUpButton>

                <Select.Viewport minHeight={200}>
                  <Select.Group>
                    {users.map((user) => (
                      <Select.Item index={user.id} key={user.id} value={user.id}>
                        <Select.ItemText>{user.userName}</Select.ItemText>
                        <Select.ItemIndicator marginLeft="auto">
                          <Check size={16} />
                        </Select.ItemIndicator>
                      </Select.Item>
                    ))}
                  </Select.Group>
                </Select.Viewport>

                <Select.ScrollDownButton
                  alignItems="center"
                  justifyContent="center"
                  position="relative"
                  width="100%"
                  height="$3"
                >
                  <YStack zIndex={10}>
                    <ChevronDown size={20} />
                  </YStack>
                </Select.ScrollDownButton>
              </Select.Content>
            </Select>
          </YStack>
        </YStack>
      </YStack>
    )
  }

  // Show skeleton while loading selected user data
  if (loading && !data) {
    return <WalletSkeleton />
  }

  if (!user)
    return (
      <YStack f={1} jc="center" ai="center" p="$4">
        <Text color="#6B7280" fontSize="$5">
          No user data found for ID: {selectedUserId}
        </Text>
      </YStack>
    )

  const transactions = [...user.transactions].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )

  const availableRecipients = users.filter((u) => u.id !== selectedUserId)

  return (
    <YStack
      f={1}
      jc="flex-start"
      ai="center"
      p="$4"
      space="$4"
      minHeight="100vh"
      backgroundColor="#F9FAFB"
    >
      {/* Container for all content */}
      <YStack
        width="100%"
        maxWidth={1200}
        backgroundColor="white"
        borderRadius={24}
        borderWidth={1}
        borderColor="#E5E7EB"
        elevation="$4"
        p="$5"
        m={'auto'}
        space="$5"
        shadowColor="#00000020"
        shadowRadius={12}
        shadowOffset={{ width: 0, height: 4 }}
      >
        {/* Header Section */}
        <YStack space="$4" w="100%" ai="center" py="$3">
          <XStack
            ai="center"
            jc="space-between"
            w="100%"
            $sm={{ flexDirection: 'column', space: '$2' }}
          >
            <H1 ta="center" color="#1D4ED8" $sm={{ fontSize: '$8' }}>
              P2P Digital Wallet
            </H1>
            <Button
              size="$3"
              variant="outlined"
              onPress={() => setSelectedUserId('')}
              $sm={{ mt: '$2' }}
              borderColor="#1D4ED8"
              color="#1D4ED8"
            >
              Switch User
            </Button>
          </XStack>

          <YStack ai="center" space="$2">
            <Paragraph ta="center" color="#6B7280" fontSize="$5">
              Welcome,{' '}
              <Text fontWeight="600" color="#1E40AF">
                {user.userName}
              </Text>{' '}
              👋
            </Paragraph>
            <YStack
              backgroundColor="#DBEAFE"
              p="$4"
              borderRadius={16}
              borderWidth={1}
              borderColor="#93C5FD"
              ai="center"
            >
              <Text color="#1E40AF" fontSize="$3" opacity={0.8}>
                Current Balance
              </Text>
              <Text fontWeight="bold" fontSize="$9" color="#1E3A8A" $sm={{ fontSize: '$8' }}>
                ${parseFloat(user.currentBalance).toFixed(2)}
              </Text>
            </YStack>
          </YStack>
        </YStack>

        {/* Send Money Section */}
        <YStack
          w="100%"
          space="$4"
          backgroundColor="#FFFFFF"
          p="$5"
          borderRadius={16}
          borderWidth={1}
          borderColor="#D1D5DB"
          elevation="$1"
        >
          <Text fontWeight="600" fontSize="$6" color="#111827">
            💸 Send Money
          </Text>

          <YStack space="$3">
            <YStack space="$2">
              <Text fontSize="$4" color="#6B7280">
                Recipient:
              </Text>
              <Select value={recipientId} onValueChange={setRecipientId}>
                <Select.Trigger w="100%" iconAfter={ChevronDown} size="$4">
                  <Select.Value placeholder="Select recipient..." />
                </Select.Trigger>

                <Adapt when="sm" platform="touch">
                  <Sheet modal dismissOnSnapToBottom>
                    <Sheet.Frame>
                      <Sheet.ScrollView>
                        <Adapt.Contents />
                      </Sheet.ScrollView>
                    </Sheet.Frame>
                    <Sheet.Overlay />
                  </Sheet>
                </Adapt>

                <Select.Content zIndex={200000}>
                  <Select.ScrollUpButton
                    alignItems="center"
                    justifyContent="center"
                    position="relative"
                    width="100%"
                    height="$3"
                  >
                    <YStack zIndex={10}>
                      <ChevronUp size={20} />
                    </YStack>
                  </Select.ScrollUpButton>

                  <Select.Viewport minHeight={200}>
                    <Select.Group>
                      {availableRecipients.map((recipient) => (
                        <Select.Item index={recipient.id} key={recipient.id} value={recipient.id}>
                          <Select.ItemText>{recipient.userName}</Select.ItemText>
                          <Select.ItemIndicator marginLeft="auto">
                            <Check size={16} />
                          </Select.ItemIndicator>
                        </Select.Item>
                      ))}
                    </Select.Group>
                  </Select.Viewport>

                  <Select.ScrollDownButton
                    alignItems="center"
                    justifyContent="center"
                    position="relative"
                    width="100%"
                    height="$3"
                  >
                    <YStack zIndex={10}>
                      <ChevronDown size={20} />
                    </YStack>
                  </Select.ScrollDownButton>
                </Select.Content>
              </Select>
            </YStack>

            <YStack space="$2">
              <Text fontSize="$4" color="#6B7280">
                Amount ($):
              </Text>
              <Input
                placeholder="0.00"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                size="$4"
                borderColor={amount && !isNaN(parseFloat(amount)) ? '#10B981' : '#D1D5DB'}
              />
            </YStack>
          </YStack>

          <Button
            onPress={handleSend}
            disabled={sending || !recipientId || !amount}
            theme="blue"
            size="$5"
            backgroundColor={sending ? '#9CA3AF' : '#2563EB'}
          >
            {sending ? (
              <XStack ai="center" space="$2">
                <Spinner color="white" size="small" />
                <Text color="white">Sending...</Text>
              </XStack>
            ) : (
              <Text color="white">Send Money</Text>
            )}
          </Button>

          {successMsg && (
            <XStack
              backgroundColor="#D1FAE5"
              p="$3"
              borderRadius={12}
              borderWidth={1}
              borderColor="#A7F3D0"
              ai="center"
              space="$2"
            >
              <Text fontSize="$5">✅</Text>
              <Text color="#065F46" fontWeight="600" f={1}>
                {successMsg}
              </Text>
            </XStack>
          )}

          {errorMsg && (
            <XStack
              backgroundColor="#FEE2E2"
              p="$3"
              borderRadius={12}
              borderWidth={1}
              borderColor="#FECACA"
              ai="center"
              space="$2"
            >
              <Text fontSize="$5">❌</Text>
              <Text color="#DC2626" fontWeight="600" f={1}>
                {errorMsg}
              </Text>
            </XStack>
          )}
        </YStack>

        {/* Transaction History Section */}
        <YStack
          w="100%"
          space="$4"
          backgroundColor="#FFFFFF"
          p="$5"
          borderRadius={16}
          borderWidth={1}
          borderColor="#D1D5DB"
          elevation="$1"
        >
          <Text fontWeight="600" fontSize="$6" color="#111827">
            📋 Transaction History
          </Text>

          {transactions.length === 0 ? (
            <YStack ai="center" jc="center" py="$8" mx={'$4'} space="$3" borderRadius={12}>
              <Text fontSize="$8" opacity={0.5}>
                💳
              </Text>
              <Text color="#6B7280" fontStyle="italic" ta="center">
                No transactions yet
              </Text>
              <Text color="#9CA3AF" fontSize="$3" ta="center">
                Start by sending money to someone!
              </Text>
            </YStack>
          ) : (
            <YStack space="$3">
              {transactions.map((transaction) => {
                const isSender = transaction.sender.id === selectedUserId
                const amountPrefix = isSender ? '-' : '+'
                const amountColor = isSender ? '#DC2626' : '#059669'
                const bgColor = isSender ? '#FEF2F2' : '#ECFDF5'
                const borderColor = isSender ? '#FECACA' : '#A7F3D0'

                return (
                  <YStack
                    key={transaction.id}
                    p="$4"
                    borderWidth={1}
                    borderColor={borderColor}
                    borderRadius={16}
                    backgroundColor={bgColor}
                    space="$3"
                    hoverStyle={{ scale: 1.02 }}
                    pressStyle={{ scale: 0.98 }}
                  >
                    {/* Transaction Type and User */}
                    <XStack
                      ai="center"
                      jc="space-between"
                      $sm={{ flexDirection: 'column', ai: 'flex-start', space: '$2' }}
                    >
                      <XStack ai="center" space="$2" f={1}>
                        <Text fontSize="$4">{isSender ? '📤' : '📥'}</Text>
                        <YStack f={1}>
                          <Text fontWeight="600" color="#111827" fontSize="$4">
                            {isSender ? 'Sent to' : 'Received from'}
                          </Text>
                          <Text color="#1D4ED8" fontWeight="600" fontSize="$5">
                            {isSender ? transaction.receiver.userName : transaction.sender.userName}
                          </Text>
                        </YStack>
                      </XStack>

                      <Text fontWeight="bold" fontSize="$6" color={amountColor}>
                        {amountPrefix}${parseFloat(transaction.amount).toFixed(2)}
                      </Text>
                    </XStack>

                    {/* Transaction Details */}
                    <XStack
                      jc="space-between"
                      ai="center"
                      $sm={{ flexDirection: 'column', ai: 'flex-start', space: '$1' }}
                    >
                      <Text color="#6B7280" fontSize="$3">
                        Transaction ID: {transaction.id}
                      </Text>
                      <Text color="#6B7280" fontSize="$3">
                        {new Date(transaction.timestamp).toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Text>
                    </XStack>
                  </YStack>
                )
              })}
            </YStack>
          )}
        </YStack>
      </YStack>
    </YStack>
  )
}
