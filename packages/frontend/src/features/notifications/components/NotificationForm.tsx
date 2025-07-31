import {
  FormControl,
  OutlinedInput,
  Button,
  Box,
  FormHelperText,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress
} from '@mui/material';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { NotificationFormData, targetAudienceTypes, notificationChannels, User, CreateNotificationPayload } from '../NotificationMessage';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import z from 'zod';
import { useEffect, useState } from 'react';
import Underline from '@tiptap/extension-underline';
import Heading from '@tiptap/extension-heading';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import { createNotification } from '../notificationApi';
import { zodResolver } from '@hookform/resolvers/zod';

const NotificationSchema = z.object({
  title: z.string().min(2, 'כותרת ההודעה חובה').max(100, 'כותרת ההודעה חייבת להיות עד 100 תווים'),
  content: z.string().min(1, 'תוכן ההודעה חובה'),
  audience_type: z.enum(['כל משתמשי המערכת', 'משתמש ספציפי', 'cycle', 'class']).optional(),
  audience_value: z.string().nullable(),
  channels: z.array(z.string()).min(1, 'יש לבחור לפחות ערוץ אחד'),
  send_at: z.string().nullable().optional(),
});

interface NotificationFormProps {
  onSubmit: (data: CreateNotificationPayload) => void;
  isLoading?: boolean;
}

export default function NotificationForm({ onSubmit, isLoading = false }: NotificationFormProps) {
  const { register, handleSubmit, control, setValue, getValues, formState: { errors } } = useForm<NotificationFormData>({
    resolver: zodResolver(NotificationSchema),
    defaultValues: {
      title: '',
      content: '',
      audience_value: null,
      channels: [],
      send_at: null,
    },
  });

  const selectedAudience = useWatch({ control, name: 'audience_type' });

  const [userOptions, setUserOptions] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [platformOpen, setPlatformOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Heading.configure({ levels: [1, 2] }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: 'הקלד את תוכן ההודעה כאן...' }),
    ],
    content: '',
  });

  useEffect(() => {
    setValue('content', editor?.getHTML() || '');
  // }, [editor?.getHTML()]);
}, [editor, setValue]); // הוסף editor ו־setValue כתלות

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch('/api/users');
      const json = await res.json();
      if (json.success) {
        const filtered = json.data.filter((user: User) =>
          `${user.first_name} ${user.last_name} ${user.email}`.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setUserOptions(filtered);
      }
    };
    if (showResults && searchTerm.length > 0) {
      fetchUsers();
    } else {
      setUserOptions([]);
    }
  }, [searchTerm, showResults]);

  const handleFormSubmit = async (data: NotificationFormData) => {
    try {
      const payload: CreateNotificationPayload = {
        ...data,
        content: editor?.getHTML() || '',
        audience_type: data.audience_type ?? 'כל משתמשי המערכת',
      };
      await createNotification(payload);
      onSubmit(payload);
    } catch (error) {
      console.error(error);
      alert('שגיאה בשליחת ההודעה');
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit as any)}>
      <FormControl fullWidth margin="normal" variant="outlined" error={!!errors.title}>
        <OutlinedInput
          id="title"
          type="text"
          {...register('title')}
          placeholder="כותרת ההודעה"
          disabled={isLoading}
        />
        {errors.title && <FormHelperText>{errors.title.message}</FormHelperText>}
      </FormControl>

      <FormControl fullWidth margin="normal" error={!!errors.content}>
        <Box sx={{ border: '1px solid', borderColor: errors.content ? 'error.main' : 'grey.400', borderRadius: 1, backgroundColor: '#fff', minHeight: 150 }}>
          {editor && (
            <>
              <Box sx={{ display: 'flex', gap: 1, p: 1, borderBottom: '1px solid #ccc' }}>
                <Button size="small" onClick={() => editor.chain().focus().toggleBold().run()} variant={editor.isActive('bold') ? 'contained' : 'outlined'}>B</Button>
                <Button size="small" onClick={() => editor.chain().focus().toggleItalic().run()} variant={editor.isActive('italic') ? 'contained' : 'outlined'}>I</Button>
                <Button size="small" onClick={() => editor.chain().focus().toggleUnderline().run()} variant={editor.isActive('underline') ? 'contained' : 'outlined'}>U</Button>
                <Button size="small" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} variant={editor.isActive('heading', { level: 1 }) ? 'contained' : 'outlined'}>H1</Button>
                <Button size="small" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} variant={editor.isActive('heading', { level: 2 }) ? 'contained' : 'outlined'}>H2</Button>
                <Button size="small" onClick={() => editor.chain().focus().setTextAlign('right').run()}>ימין</Button>
                <Button size="small" onClick={() => editor.chain().focus().setTextAlign('center').run()}>מרכז</Button>
                <Button size="small" onClick={() => editor.chain().focus().setTextAlign('left').run()}>שמאל</Button>
              </Box>
              <Box sx={{ p: 2, minHeight: 100 }}>
                <EditorContent editor={editor} />
              </Box>
            </>
          )}
        </Box>
        {errors.content && <FormHelperText>{errors.content.message}</FormHelperText>}
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel id="target-label">בחר קהל יעד</InputLabel>
        <Controller
          control={control}
          name="audience_type"
          render={({ field }) => (
            <Select labelId="target-label" {...field} label="בחר קהל יעד" disabled={isLoading}>
              {targetAudienceTypes.map((value) => (
                <MenuItem key={value} value={value}>{value}</MenuItem>
              ))}
            </Select>
          )}
        />
      </FormControl>

      {selectedAudience === 'משתמש ספציפי' && (
        <FormControl fullWidth margin="normal">
          <OutlinedInput
            placeholder="חיפוש לפי שם או אימייל"
            value={searchTerm}
            onFocus={() => setShowResults(true)}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isLoading}
          />
          {showResults && userOptions.length > 0 && (
            <Box sx={{ border: '1px solid #ccc', maxHeight: 200, overflowY: 'auto' }}>
              {userOptions.map((user) => (
                <MenuItem
                  key={user.id}
                  onClick={() => {
                    setSearchTerm(`${user.first_name} ${user.last_name}`);
                    setSelectedUser(user);
                    setValue('audience_value', user.id);
                    setShowResults(false);
                  }}
                >
                  {user.first_name} {user.last_name} ({user.email})
                </MenuItem>
              ))}
            </Box>
          )}
        </FormControl>
      )}

      <FormControl fullWidth margin="normal">
        <InputLabel id="platform-label">בחר פלטפורמות הפצה</InputLabel>
        <Controller
          control={control}
          name="channels"
          render={({ field: { onChange, value } }) => (
            <Select
              labelId="platform-label"
              multiple
              open={platformOpen}
              onOpen={() => setPlatformOpen(true)}
              onClose={() => setPlatformOpen(false)}
              value={value}
              onChange={(e) => {
                onChange(e.target.value);
                setPlatformOpen(false);
              }}
              label="בחר פלטפורמות הפצה"
              disabled={isLoading}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {(selected as string[]).map((val) => (
                    <Chip key={val} label={val} />
                  ))}
                </Box>
              )}
            >
              {notificationChannels.map((val) => (
                <MenuItem key={val} value={val}>{val}</MenuItem>
              ))}
            </Select>
          )}
        />
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel shrink>תאריך תזמון השליחה</InputLabel>
        <Controller
          control={control}
          name="send_at"
          render={({ field }) => (
            <OutlinedInput type="datetime-local" {...field} disabled={isLoading} />
          )}
        />
      </FormControl>

      {selectedUser && (
        <Box sx={{ m: 1, fontWeight: 'bold' }}>
          שולחת ל: {selectedUser.first_name} {selectedUser.last_name} ({selectedUser.email})
        </Box>
      )}

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={isLoading}
        sx={{ bgcolor: '#442063', mt: 2, mb: 2, height: '48px', fontSize: '1.1rem', borderRadius: '30px', '&:hover': { bgcolor: '#442063' } }}
      >
        {isLoading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'שלחי עדכון'}
      </Button>
    </form>
  );
}